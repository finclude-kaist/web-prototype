import os
import pandas as pd
from dotenv import load_dotenv
from langchain_community.chat_models import ChatOpenAI
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Qdrant
from qdrant_client import QdrantClient
from langchain.chains import LLMChain, RetrievalQA
from langchain.prompts import PromptTemplate
import datetime
import re

import warnings
try:
    from langchain_core._api.deprecation import LangChainDeprecationWarning
    warnings.filterwarnings("ignore", category=LangChainDeprecationWarning)
except ImportError:
    pass

warnings.filterwarnings("ignore", category=DeprecationWarning)

load_dotenv()
def init_retriever(collection_name: str) -> Qdrant:
    client     = QdrantClient(url=os.getenv("QDRANT_URL", "http://localhost:6333"))
    embeddings = OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key=os.getenv("OPENAI_API_KEY")
    )
    vectordb   = Qdrant(
        client=client,
        collection_name=collection_name,
        embeddings=embeddings
    )
    return vectordb.as_retriever(search_kwargs={"k": 5})

# 0) 고객 투자 내역 로드 & 문자열로 변환
user_df = pd.read_csv("UserInfo.csv")
# Markdown 테이블 형태로 LLM에 전달
user_info_str = user_df.to_markdown(index=False)

# 1) LLM 세팅 (gpt-4o-mini)
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.2,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

# 2) 시장 조사 에이전트 (RetrievalQA + custom question_prompt)
market_prompt = PromptTemplate(
    input_variables=["query", "context"],
    template=(
        f"User Investment History(shows the user's interest):\n{user_info_str}\n\n"
        "You are a personal market research agent.\n"
        "Question: {query}\n\n"
        "Retrieved Documents:\n{context}\n\n"
        "Based on the above, search the RAG DB and summarize the key market insights with original sources(including not only the source title, but also all the content of each source)."
        "do not include any stock recommendations or predictions."
    )
)
news_retriever      = init_retriever("news_articles")
social_retriever    = init_retriever("social_media")
fin_retriever       = init_retriever("financial_reports")
macro_retriever     = init_retriever("macro_indicators")
sentiment_retriever = init_retriever("sentiment_data")
price_retriever     = init_retriever("price_time_series")

market_chain = LLMChain(llm=llm, prompt=market_prompt)

# 3) 종목 추천 에이전트
recommend_prompt = PromptTemplate(
    input_variables=["market_summary"],
    template=(
        f"User Investment History(shows the user's interest):\n{user_info_str}\n\n"
        "You are a personal financial advisor.\n"
        "Based on this market research summary:\n\n"
        "{market_summary}\n\n"
        "Provide a list of stocks expected to rise or fall, with concise reasons."
    )
)
recommend_chain = LLMChain(llm=llm, prompt=recommend_prompt)

# 4) 과거 분석 에이전트
analyze_prompt = PromptTemplate(
    input_variables=["recommendations", "context", "market_summary"],
    template=(
        f"User Investment History(shows the user's interest):\n{user_info_str}\n\n"
        "You are a personal financial data analyst.\n"
        "Given these informations:\n\n"
        "- stock recommendations:\n{recommendations}\n"
        "- real past price and volume data of the recommended stocks:\n{context}\n"
        "- market summary which is used for the stock recommendation process:\n{market_summary}\n"
        "For all of each recommended stocks,"
        f"Look carefully at the past one month of price and volume data. (Today is {datetime.datetime.today()})"
        "Then, analyze correlations between the stock prices and the market summary."
    )
)
analyze_chain = LLMChain(llm=llm, prompt=analyze_prompt)

# 5) 미래 예측 에이전트
predict_prompt = PromptTemplate(
    input_variables=["recommendations","analysis_summary"],
    template=(
        f"User Investment History(shows the user's interest):\n{user_info_str}\n\n"
        "You are a personal market forecaster.\n"
        "These are the stock recommendations:\n\n"
        "{recommendations}\n\n"
        "Based on this historical analysis of the recommended stocks:\n\n"
        "{analysis_summary}\n\n"
        "Predict the future performance of the recommended stocks and justify your reasoning."
        "Then, rank the stocks by their expected performance in the next 3 months."
    )
)
predict_chain = LLMChain(llm=llm, prompt=predict_prompt)

def extract_tickers(recommendations: str) -> list[str]:
    # 대문자 알파벳 2~5자리 연속 패턴을 티커로 가정
    raw = re.findall(r"\b[A-Z]{2,5}\b", recommendations)
    # 중복 제거
    return list(dict.fromkeys(raw))


def run_pipeline(user_query: str) -> dict:
    """4단계 파이프라인을 순차적으로 실행하고 결과를 반환."""
    # 1) 시장조사
    docs = []
    for retriever in [
        news_retriever,
        social_retriever,
        fin_retriever,
        macro_retriever,
        sentiment_retriever,
        price_retriever
    ]:
        docs.extend(retriever.get_relevant_documents(user_query))

    # 2) docs 리스트를 하나의 문자열로 포매팅 (헤딩 + 코드 블록)
    formatted_docs = []
    for i, doc in enumerate(docs, 1):
        src = doc.metadata.get("source_id", str(i))
        formatted_docs.append(
            f"### Source {src}\n"
            f"```\n"
            f"{doc.page_content}\n"
            f"```"
        )
    context_str = "\n\n".join(formatted_docs)
    
    market_res     = market_chain.invoke({
        "query":   user_query,
        "context": context_str
    })
    market_summary  = market_res["text"]

    # 2) 종목추천
    rec_out = recommend_chain.invoke({"market_summary": market_summary})
    recommendations = rec_out["text"]


    # 3) 과거분석
    tickers = extract_tickers(recommendations)
    price_docs = []
    for ticker in tickers:
        price_docs.extend(price_retriever.get_relevant_documents(ticker))
    formatted_price = []
    for doc in price_docs:
        src = doc.metadata.get("source_id", "")
        formatted_price.append(f"[{src}] {doc.page_content}")
    price_context = "\n\n".join(formatted_price)
    ana_out = analyze_chain.invoke({
        "recommendations": recommendations,
        "context": price_context,
        "market_summary": market_summary})
    analysis_summary = ana_out["text"]

    # 4) 미래예측
    pred_out = predict_chain.invoke({
        "recommendations": recommendations,
        "analysis_summary": analysis_summary
        })
    prediction = pred_out["text"]

    return {
        "market_summary":   market_summary,
        "recommendations":  recommendations,
        "analysis_summary": analysis_summary,
        "prediction":       prediction
    }

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Run the 4-step stock advisory pipeline")
    parser.add_argument("--query", type=str, required=True, help="User's market interest or prompt")
    args = parser.parse_args()

    outputs = run_pipeline(args.query)
    print("=== Market Research ===\n", outputs["market_summary"], "\n")
    print("=== Recommendations ===\n", outputs["recommendations"], "\n")
    print("=== Historical Analysis ===\n", outputs["analysis_summary"], "\n")
    print("=== Future Predictions ===\n", outputs["prediction"])
