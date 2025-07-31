# rag_db_setup.py

import os
from dotenv import load_dotenv
import re
import pandas as pd
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Qdrant
from qdrant_client import QdrantClient
from qdrant_client.http.models import Distance
import uuid

load_dotenv()

def create_collections(qdrant_client):
    """RAG용 컬렉션을 모두 새로 생성(또는 재생성)합니다."""
    collections = {
        "news_articles": 1536,
        "social_media": 1536,
        "financial_reports": 1536,
        "macro_indicators": 1536,
        "sentiment_data": 1536,
        "price_time_series": 1536,
    }
    for name, dim in collections.items():
        if qdrant_client.collection_exists(name):
            qdrant_client.delete_collection(name)
        qdrant_client.recreate_collection(
            collection_name=name,
            vectors_config={"size": dim, "distance": Distance.COSINE}
        )

def preprocess_text(text: str) -> str:
    """기본적인 공백/특수문자 정리."""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def embed_and_store(
    texts: list[str], 
    source_ids:   list[str], 
    collection_name: str, 
    qdrant_client:    QdrantClient, 
    embeddings:       OpenAIEmbeddings
):
    """임베딩 생성 후 Qdrant에 업로드."""
    vectordb = Qdrant(
        client=qdrant_client,
        collection_name=collection_name,
        embeddings=embeddings
    )
    vector_ids = [str(uuid.uuid4()) for _ in texts]
    metadatas  = [{"source_id": src} for src in source_ids]
    vectordb.add_texts(
        texts=texts,
        metadatas=metadatas,
        ids=vector_ids
    )
    
def main():
    # 환경변수로 OPENAI_API_KEY, QDRANT_URL 설정 필요
    openai_api_key = os.getenv("OPENAI_API_KEY")
    qdrant_url     = os.getenv("QDRANT_URL", "http://localhost:6333")

    embeddings     = OpenAIEmbeddings(
        model="text-embedding-3-small",
        openai_api_key=openai_api_key
    )
    qdrant_client  = QdrantClient(url=qdrant_url)

    # 컬렉션 생성
    create_collections(qdrant_client)

    # 뉴스 기사
    news_df   = pd.read_csv("data/news_articles.csv")       # columns: id,title,content
    news_texts = [
        preprocess_text(f"{row.title}\n\n{row.content}") 
        for row in news_df.itertuples()
    ]
    embed_and_store(
        texts=news_texts,
        source_ids=news_df.id.astype(str).tolist(),
        collection_name="news_articles",
        qdrant_client=qdrant_client,
        embeddings=embeddings
    )
    print(f"Stored {len(news_texts)} news articles in Qdrant.")

    # 소셜 미디어
    social_df = pd.read_csv("data/social_media.csv")       # columns: id,platform,text
    social_texts = [
        preprocess_text(row.text) 
        for row in social_df.itertuples()
    ]
    embed_and_store(
        texts=social_texts,
        source_ids=social_df.id.astype(str).tolist(),
        collection_name="social_media",
        qdrant_client=qdrant_client,
        embeddings=embeddings
    )
    print(f"Stored {len(social_texts)} social media posts in Qdrant.")

    # 재무제표·공시
    fin_df = pd.read_csv("data/financial_reports.csv")     # columns: id,report_text
    fin_texts = [
        preprocess_text(row.report_text) 
        for row in fin_df.itertuples()
    ]
    embed_and_store(
        texts=fin_texts,
        source_ids=fin_df.id.astype(str).tolist(),
        collection_name="financial_reports",
        qdrant_client=qdrant_client,
        embeddings=embeddings
    )
    print(f"Stored {len(fin_texts)} financial reports in Qdrant.")

    # 거시경제 지표
    macro_df = pd.read_csv("data/macro_indicators.csv")    # id,indicator,date,value
    macro_texts = [
        preprocess_text(f"{row.indicator} on {row.date}: {row.value}") 
        for row in macro_df.itertuples()
    ]
    embed_and_store(
        texts=macro_texts,
        source_ids=macro_df.id.astype(str).tolist(),
        collection_name="macro_indicators",
        qdrant_client=qdrant_client,
        embeddings=embeddings
    )
    print(f"Stored {len(macro_texts)} macro indicators in Qdrant.")

    # 여론 데이터 (Google Trends, ESG 등)
    senti_df = pd.read_csv("data/sentiment_data.csv")      # id,topic,score,date
    senti_texts = [
        preprocess_text(f"{row.topic} sentiment {row.score} on {row.date}") 
        for row in senti_df.itertuples()
    ]
    embed_and_store(
        texts=senti_texts,
        source_ids=senti_df.id.astype(str).tolist(),
        collection_name="sentiment_data",
        qdrant_client=qdrant_client,
        embeddings=embeddings
    )
    print(f"Stored {len(senti_texts)} sentiment data in Qdrant.")

    # 종목별 시계열 데이터
    price_df = pd.read_csv("data/price_time_series.csv")   # id,ticker,date,close,volume
    price_texts = [
        preprocess_text(f"{row.ticker} price on {row.date}: close={row.close}, vol={row.volume}") 
        for row in price_df.itertuples()
    ]
    embed_and_store(
        texts=price_texts,
        source_ids=price_df.id.astype(str).tolist(),
        collection_name="price_time_series",
        qdrant_client=qdrant_client,
        embeddings=embeddings
    )
    print(f"Stored {len(price_texts)} price time series in Qdrant.")

if __name__ == "__main__":
    main()
