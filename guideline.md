개인 맞춤형 RAG 기반 AI 주식 투자 자문 서비스

팀명 (학교): Finclude (KAIST)
팀원: 김환, 김지혁, 원대한

I. 서비스 제안 배경 및 필요성

뉴스 기사 같은거 최대한 찾아 넣으면 좋을 듯

II. 데이터 수집 및 가공 방법

어떤 데이터 쓸 건지를 프로토타입에서 실제로 쓴 것 + 더 활용하면 좋을 것 조사해서 작성해줘유 + 미래에셋 고객 정보 활용

가공 방법은 카톡으로 말한 것처럼 열 이름 정해져 있는 csv로

III. 사용 LLM 및 데이터 적용 방법 상세

가) 사용 LLM
Gpt-4o-mini를 사용하였다. 본 대회에서 권장한 HyperClova를 최대한 활용해보려고 했으나, 본 팀의 팀원들이 모두 미성년자인 관계로 네이버클라우드 플랫폼 가입이 불가능했기 때문에 활용이 어려웠다. 결국 연령 제한 없이 사용할 수 있고 개인적으로 보유하고 있기도 했던 gpt-4o-mini API를 사용하게 되었다.

나) 데이터 적용 방법
앞서 언급한 수집 대상이었던 뉴스 기사 데이터, 소셜 미디어 데이터, 기업 공시 및 재무제표 데이터, 거시경제 지표 데이터, 종목별 주가/거래량 등 시계열 데이터 등등 다양한 데이터들을 모두 수집하여 임베딩한 후 RAG용 데이터베이스(벡터DB)에 업로드하는 방식으로 적용한다. 

소스코드 프로토타입에서는 보다 구체적으로, 21개의 종목을 선정하여(너무 많은 종목에 대해 조사하고 실험하기에는 시간적, 비용적 여유가 부족했기 때문에) 각 종목에 대해 뉴스 기사 데이터 / 소셜 미디어 데이터 /  금융 보고서 데이터 / 거시 경제 지표 데이터 / 구글 트렌드 데이터 / 시계열 주가 변화 데이터 등 6개의 데이터셋을 수집하였다. 
선정한 21개의 종목은 다음과 같다: 
AI 관련 주식: NVDA, MSFT, AAPL, GOOGL, IBM, AMD, INTC
신재생 에너지 관련 주식: TSLA, ENPH, FSLR, BE, RUN, SPWR, PLUG
제약 바이오 관련 주식: JNJ, PEE, MRK, BNTX, GILD, REGN, AMGN
<데이터셋별 수집 방법 (프로토타입)>
데이터
뉴스 기사
소셜 미디어
금융 보고서
거시 경제 지표
구글 트렌드
시계열 주가 변화
수집 방법
Newsapi를 이용하여 종목명으로 기사 검색 (총 1560개 기사 수집)
Reddit API를 이용하여 종목명으로 커뮤니티 글 및 댓글 검색 (총 797개 글 수집) 
Yahoo Finance API를 이용하여 종목별로 2020~2024년 말일의 세율, 매출, 이익 등 검색
FRED API를 이용하여 종목별로 2022~2024년 동안의 달별 소비자 물가지수, 실업률 등 검색
구글 트렌드를 위한 pytrend 모듈을 이용하여 2023년 5월 21일부터 1주일 간격으로 각 종목별 구글 트렌드 스코어 수집
Yahoo Finance API를 이용하여 종목별로 최근 2년간 종가 및 거래량 데이터 수집 
경로
data/news_articles.csv
data/social_media.csv
data/financial_reports.csv
data/macro_indicators.csv
data/sentiment_data.csv
data/price_time_series.csv

프로토타입 소스코드에서는 Qdrant 벡터 DB의 url을 로컬에서 열어(도커 이용) 활용했다. 위 표대로 각 정리된 csv 파일을 OpenAIEmbeddings를 통해 임베딩한 뒤 Qdrant에 업로드해서 사용한 것이다.
또한 전반적인 RAG 과정은 모두 LangChain 환경에서 진행하였다.

이뿐 아니라 개인 맞춤형 서비스를 개발하는 것이 목표이기 때문에 미래에셋 고객 정보로 이용자의 주식 거래 내역 데이터 또한 활용하여 개발해보기로 하였다. 고객 정보 스키마를 임의로 정의해서 사용해도 된다고 나와 있어서, 임의로 이용자의 주식 거래 내역을 종목, 날짜, 매수/매도량, 남은 자산 이렇게 4가지 열로 구성되도록 하여 UserInfo.csv로 저장한 뒤 이용했다.

IV. 서비스 구조도/알고리즘 흐름도

데이터 수집 → 임베딩/업로드 → 에이전트 4단계

프로토타입 소스코드에서는 이 흐름도 중 에이전트 4단계 파이프라인을 다음과 같이 구현했다.
쿼리 입력 받기: 사용자가 이 서비스를 통해 얻고 싶은 것 입력 받기 (ex: 자율주행 관련 유망 주식 추천해줘)
시장 조사 에이전트: Qdrant에 올린 각 데이터셋(news_articles, social_media, financial_reports, macro_indicators, sentiment_data, price_time_series)별로 retriever를 초기화한 뒤 각 retriever에 쿼리를 검색하여 쿼리에 대한 DB 기반 참고 문서(context) 만들기. 이후 1)에서 입력받은 쿼리, context, 그리고 UserInfo.csv에서 읽어온 사용자 정보(user_info_str)를 활용하여 시장 정보를 출처와 함께 요약해주는 AI 시스템 프롬프트 설정하기.
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
종목 추천 에이전트: 2)의 시장 조사 에이전트의 출력값(market_summary)과 user_info_str를 활용하여 주가가 상승할 종목, 하락할 종목 각각의 추천 리스트와 그 추천 이유를 출력하기
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
과거 분석 에이전트: 3)의 종목 추천 에이전트의 출력값(recommendations), recommendations 텍스트 중 종목 이름만 뽑아내어 이를 price_time_series로 초기화한 retriever에 검색한 결과(context - 추천한 종목들의 시계열 주가/거래량 변화 데이터 뽑아낸 것), 2)의 시장 조사 에이전트의 출력값(market_summary), user_info_str를 활용하여 시장 조사 결과와 실제 이전 한 달의 주가 변동 및 거래량 변동이 어떤 상관 관계가 있는지를 종목별로 분석하기
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
미래 예측 에이전트: 3)의 종목 추천 에이전트의 출력값(recommendations), 4)의 과거 분석 에이전트의 출력값(analysis_summary), user_info_str를 활용하여 최종 추천 종목별 주가 상승/하락 여부를 과거 데이터로부터 분석한 상관 관계 결과를 바탕으로 예측하고 추천하는 종목 순위를 매겨서 출력하기
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

V. 서비스 사용제안에 대한 사용 예시 및 향후 계획

가) 소스 코드(프로토타입) 실행 예시

파일명
get_data.py
rag_db_setup.py
agents_pipeline.py
역할
여러 API를 활용하여 21개의 종목에 대해 데이터 수집 및 csv 파일로 정리
Qdrant에 수집한 csv 데이터 임베딩 후 업로드 (랭체인 활용)
4개의 단계별 에이전트에 대해 gpt-4o-mini 기반 RAG 및 프롬프트 엔지니어링 등을 UserInfo를 반영하여 구현 (랭체인 활용)



python agents_pipeline.py --query "Recommend what stocks to buy about AI technology."
(AI 기술에 관한 주식 추천을 원하는 상황)

UserInfo.csv (사용자의 개인적인 투자 내역 - 종목, 날짜, 매수/매도량, 보유 자산 - 미래에셋에서 이용할 수 있는 고객 정보를 임의로 스키마를 적용하여 활용한 것)
Ticker,Date,Quantity,RemainingBalance
AAPL,2025-06-10,50,11000
TSLA,2025-06-15,20,6000
AAPL,2025-06-20,-10,7900
GOOG,2025-07-01,5,7225
TSLA,2025-07-05,-5,8525

<LLM Agent 파이프라인의 분석 & 추천 결과 (소스코드 실행 결과)>

=== Market Research ===
 ### Key Market Insights on AI Technology Stocks

1. **AI as a Dominant Investment Theme**:
   - **Source 228**: The article discusses the resurgence of interest in artificial intelligence (AI) as a leading investment theme, particularly as major tech companies like Apple (AAPL), Amazon (AMZN), Microsoft (MSFT), and Meta Platforms (META) prepare to release their earnings for the June quarter. The focus on AI is expected to influence market dynamics significantly.

2. **Google's Investment in AI**:
   - **Source 330**: Google has initiated a new wave of spending on AI, which is anticipated to boost demand for chips and AI tools. This investment trend suggests that companies involved in AI technology and infrastructure may see increased growth opportunities.

3. **Emerging AI Stocks**:
   - **Source 101**: The article highlights an under-the-radar AI stock that has outperformed major tech companies in 2025. This suggests that there are still hidden opportunities in the AI sector that could yield significant returns for investors.

4. **Market Sentiment on AI Stocks**:
   - **Source 69**: A personal sentiment is shared regarding the purchase of AI stocks, including NVIDIA (NVDA) and Microsoft (MSFT), indicating a belief that these investments will be profitable as AI technology continues to evolve and integrate into various industries.

5. **Focus on AI Chips and Infrastructure**:
   - **Source 223**: The discussion revolves around the strong performance of stocks like NVIDIA (NVDA), AMD, and TSMC, which are central to the AI chip market. The emphasis on compute power and data centers highlights the critical role of semiconductor companies in the AI landscape.

6. **Caution in Semiconductor Investments**:
   - **Source 248**: The article expresses caution regarding investments in semiconductor companies, noting the cyclical nature of the industry. It suggests that while there are opportunities, investors should be wary of the volatility associated with semiconductor stocks, particularly in the context of AI.

7. **Diverse Investment Strategies**:
   - **Source 68**: A young investor shares their approach to investing, weighing the benefits of AI stocks against more defensive options like energy or dividend stocks. This reflects a broader trend where investors are considering a mix of aggressive and conservative strategies in their portfolios.

8. **Concerns About Major Tech Companies**:
   - **Source 169**: There are concerns regarding Apple's ability to innovate in the AI space, with comparisons made to IBM. This sentiment indicates that while some tech giants are leading in AI, others may be lagging, which could affect their market positions.

These insights collectively illustrate the dynamic landscape of AI technology investments, highlighting both opportunities and challenges within the sector. Investors are encouraged to stay informed about market trends and company performances as the AI narrative continues to unfold.

=== Recommendations ===
 Based on the market research summary and your investment history, here’s a list of stocks that are expected to rise or fall, along with concise reasons:

### Stocks Expected to Rise

1. **NVIDIA (NVDA)**
   - **Reason**: Strong performance in the AI chip market, driven by increasing demand for AI technology and infrastructure. NVIDIA is a leader in this space, making it a prime candidate for growth.

2. **Microsoft (MSFT)**
   - **Reason**: Significant investments in AI and positive market sentiment surrounding its AI initiatives. As major tech companies prepare to release earnings, Microsoft is expected to benefit from its AI strategy.

3. **Google (GOOGL)**
   - **Reason**: Increased spending on AI and a focus on enhancing AI tools and infrastructure. This investment trend is likely to boost Google's growth potential in the AI sector.

4. **Advanced Micro Devices (AMD)**
   - **Reason**: Similar to NVIDIA, AMD is positioned well in the AI chip market. The demand for AI-related hardware is expected to drive growth for companies like AMD.

5. **Emerging AI Stocks (specific stock not named)**
   - **Reason**: The mention of an under-the-radar AI stock that has outperformed major tech companies suggests there are hidden opportunities in the AI sector that could yield significant returns.

### Stocks Expected to Fall

1. **Apple (AAPL)**
   - **Reason**: Concerns about Apple's ability to innovate in the AI space, with comparisons to IBM suggesting potential stagnation. This could negatively impact investor sentiment and stock performance.

2. **Semiconductor Companies (General)**
   - **Reason**: While there are opportunities, the cyclical nature of the semiconductor industry and associated volatility may lead to caution among investors. This could result in a decline in stock prices for companies in this sector.      

### Summary
Investors should consider focusing on stocks like NVIDIA, Microsoft, Google, and AMD for potential growth, while being cautious about investing in Apple and semiconductor companies due to concerns about innovation and market volatility. Diversifying investments and staying informed about market trends will be crucial in navigating this dynamic landscape.

=== Historical Analysis ===
 To analyze the correlations between the stock prices of the recommended stocks (NVIDIA, Microsoft, Google, and AMD) and the market summary insights, we will look at the past month of price and volume data for each stock, focusing on trends and how they align with the market insights provided.

### Price and Volume Data Analysis (Past Month)

1. **NVIDIA (NVDA)**
   - **Price on 2025-06-05**: $139.99
   - **Price on 2025-07-09**: $162.88
   - **Price Change**: +16.3%
   - **Volume on 2025-06-05**: 231,397,900
   - **Volume on 2025-07-09**: 183,656,400

   **Analysis**: The significant price increase aligns with the market sentiment that emphasizes NVIDIA's strong position in the AI chip market. The volume data shows high trading activity, indicating strong investor interest, which correlates with the positive outlook on AI technology investments.

2. **Microsoft (MSFT)**
   - **Price on 2025-05-08**: $438.17
   - **Price on 2025-06-05**: Not provided, but we can infer it was stable or slightly increasing based on the trend.
   - **Price Change**: Not directly calculable, but the sentiment around Microsoft's investments in AI suggests a positive trend.
   - **Volume on 2025-05-08**: 23,491,300

   **Analysis**: The focus on Microsoft's AI initiatives in the market summary suggests that the stock is likely to perform well. However, without specific recent price data, we cannot quantify the change. The overall sentiment indicates that investors are optimistic about Microsoft's future, which may be reflected in its stock performance.

3. **Google (GOOGL)**
   - **Price on 2025-06-10**: $178.60 (latest available)
   - **Price Change**: Not applicable for a month-over-month comparison, but the focus on AI investments suggests a positive outlook.
   - **Volume on 2025-06-10**: 61,766,100

   **Analysis**: Google's increased spending on AI aligns with the positive sentiment in the market summary. The high volume indicates strong investor interest, which is consistent with the expectation of growth in AI-related sectors.

4. **Advanced Micro Devices (AMD)**
   - **Price on 2025-06-05**: $115.69
   - **Price Change**: Not provided for the last month, but previous data shows fluctuations.
   - **Volume on 2025-06-05**: 34,091,000

   **Analysis**: AMD's position in the AI chip market is similar to NVIDIA's, and the market summary suggests that there are opportunities for growth. However, the cyclical nature of the semiconductor industry raises caution, which could affect AMD's stock performance.

### Correlation with Market Summary Insights

1. **AI as a Dominant Investment Theme**: The overall positive performance of NVIDIA and the strong interest in Microsoft and Google reflect the resurgence of AI as a leading investment theme. Stocks in this sector are seeing increased demand, aligning with the insights.

2. **Google's Investment in AI**: The focus on Google's AI spending is supported by the observed interest in its stock, as indicated by the volume data. This suggests that investors are responding positively to Google's strategic direction.   

3. **Emerging AI Stocks**: The mention of under-the-radar AI stocks implies that there are opportunities beyond the major players. While we don't have specific data on these stocks, the overall trend in AI investments suggests a favorable environment for growth.

4. **Market Sentiment on AI Stocks**: The positive sentiment surrounding NVIDIA and Microsoft aligns with the market's expectation of profitability in AI technology. The price increases for NVIDIA, in particular, support this sentiment.       

5. **Caution in Semiconductor Investments**: While NVIDIA and AMD are positioned well, the caution regarding semiconductor stocks is warranted given the cyclical nature of the industry. This could impact AMD's performance despite its potential in AI.

6. **Concerns About Major Tech Companies**: The concerns regarding Apple's innovation in AI contrast with the positive outlook for NVIDIA, Microsoft, and Google. This divergence highlights the varying performance expectations among tech giants.

### Conclusion

The analysis of the past month’s price and volume data for NVIDIA, Microsoft, Google, and AMD shows a strong correlation with the market insights provided. Stocks like NVIDIA and Microsoft are experiencing positive momentum, driven by their strategic investments in AI technology. In contrast, caution is advised for semiconductor stocks like AMD due to industry volatility. Overall, the market sentiment supports a favorable outlook for AI-related investments, while concerns about innovation in companies like Apple may lead to a more cautious approach for those stocks.

=== Future Predictions ===
 Based on the analysis of the market insights, historical performance, and current trends in the AI sector, I will predict the future performance of the recommended stocks and provide a ranking based on their expected performance over the next three months.

### Predictions for Future Performance

1. **NVIDIA (NVDA)**
   - **Prediction**: Expected to continue rising.
   - **Justification**: NVIDIA's strong position in the AI chip market, coupled with increasing demand for AI technology, positions it well for growth. The recent price increase and high trading volume indicate strong investor interest, suggesting that momentum will likely continue.

2. **Microsoft (MSFT)**
   - **Prediction**: Expected to rise moderately.
   - **Justification**: Microsoft's significant investments in AI and positive market sentiment surrounding its initiatives suggest a favorable outlook. While specific price data is lacking, the overall trend indicates that investors are optimistic about Microsoft's future, which should support its stock price.

3. **Google (GOOGL)**
   - **Prediction**: Expected to rise moderately.
   - **Justification**: Google's increased spending on AI and the positive sentiment surrounding its strategic direction align with expectations for growth. The strong trading volume indicates investor interest, which should help maintain upward momentum in its stock price.

4. **Advanced Micro Devices (AMD)**
   - **Prediction**: Expected to experience volatility but may rise slightly.    
   - **Justification**: While AMD is well-positioned in the AI chip market, the cyclical nature of the semiconductor industry raises caution. The potential for growth exists, but market volatility may limit significant price increases in the short term.

### Ranking of Stocks by Expected Performance in the Next 3 Months

1. **NVIDIA (NVDA)** - Strong growth potential due to leadership in AI chips and high investor interest.
2. **Microsoft (MSFT)** - Moderate growth expected from AI investments and positive market sentiment.
3. **Google (GOOGL)** - Moderate growth anticipated from AI spending and strong investor interest.
4. **Advanced Micro Devices (AMD)** - Potential for slight growth, but caution is warranted due to industry volatility.

### Summary

In summary, NVIDIA is expected to outperform the other stocks due to its strong market position and investor interest. Microsoft and Google are also likely to see positive performance due to their strategic investments in AI. AMD may experience some growth, but its performance could be hindered by the cyclical nature of the semiconductor industry. Investors should consider these rankings and predictions when making investment decisions in the coming months.

나) 결과 해석

결과 요약:

<종목 추천 순위>
NVDA
MSFT
GOOGL
AMD
<번외: 주가가 하락할 것으로 예측한 종목>
AAPL

실제 2025.07.31 기준 종목별 주가 변화 현황
(본 프로토타입의 데이터셋들에는 7월 30일까지의 데이터만이 들어 있음)

NVDA
MSFT
GOOGL
AMD
AAPL







위 결과를 통해 본 서비스의 예측과 실제 주가 변동이 거의 일치하는 양상을 보이는 것을 알 수 있다. 실제로 동일한 쿼리로 몇 번 더 소스 코드를 돌려봐도 거의 유사한 결과가 나온다. 물론 하나의 쿼리 예시만으로 이 서비스의 정확도를 파악하는 것은 옳지 않지만, 데이터셋을 확장하고 llm을 프롬프트 엔지니어링 또는 파인 튜닝 등을 통해 발전시키면 훨씬 광범위한 분야에서 정확도가 높은 서비스를 구현해낼 수 있을 것이라는 가능성을 보여준 실행 예시라고 볼 수 있을 것이다.

다) 서비스(프로토타입) 실행 예시

라) 향후 계획 및 발전 방향
RAG 데이터셋 확장
다양한 프롬프트 엔지니어링을 통한 성능 향상 및 서비스 안정화(CoT, few-shot 등)
파인 튜닝을 통한 성능 향상 및 서비스 안정화
최종 에이전트의 출력을 한국어로 번역하는 파이프라인 추가
소스 코드(백엔드)와 서비스(프론트엔드)를 연결하여 완전한 웹 서비스 형식으로 개발 및 배포
미래에셋증권과의 협업을 통해 서비스의 개인화를 위한 여러 고객 정보 활용
네이버클라우드와의 협업을 통해 하이퍼클로바를 랭체인과 함께 활용함으로써 보다 한국인 친화적인 서비스로 발전
