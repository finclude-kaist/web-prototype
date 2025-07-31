# Python script to collect RAG DB CSVs for 21 tickers across 6 data sources

import os
from dotenv import load_dotenv
import pandas as pd
import yfinance as yf
from newsapi import NewsApiClient
from pytrends.request import TrendReq
import tweepy
from fredapi import Fred
from datetime import datetime, timedelta
import time
import praw

ai_tickers      = ['NVDA', 'MSFT', 'AAPL', 'GOOGL', 'IBM', 'AMD', 'INTC']
renew_tickers   = ['TSLA', 'ENPH', 'FSLR', 'BE', 'RUN', 'SPWR', 'PLUG']
pharma_tickers  = ['JNJ', 'PFE', 'MRK', 'BNTX', 'GILD', 'REGN', 'AMGN']
all_tickers     = ai_tickers + renew_tickers + pharma_tickers

load_dotenv()
NEWSAPI_KEY        = os.getenv('NEWSAPI_KEY')
TWITTER_BEARER     = os.getenv('TWITTER_BEARER_TOKEN')
FRED_API_KEY       = os.getenv('FRED_API_KEY')
CLIENT_ID     = os.getenv("REDDIT_CLIENT_ID")
CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
USER_AGENT    = os.getenv("REDDIT_USER_AGENT", "stock-sentiment-scraper")

newsapi = NewsApiClient(api_key=NEWSAPI_KEY)
pytrends = TrendReq(hl='en-US', tz=360)
fred    = Fred(api_key=FRED_API_KEY)

reddit = praw.Reddit(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    user_agent=USER_AGENT
)

# === Fetch News Articles ===
news_records = []
nid = 1
for ticker in all_tickers:
    articles = newsapi.get_everything(q=ticker, language='en', sort_by='publishedAt', page_size=100)
    for art in articles['articles']:
        news_records.append({
            'id': nid,
            'title': art['title'] or '',
            'content': art['description'] or art['content'] or ''
        })
        nid += 1
news_df = pd.DataFrame(news_records)
news_df.to_csv('data/news_articles.csv', index=False)

social_records = []
sid = 1

for ticker in all_tickers:
    query = ticker
    print(f"[{datetime.now().isoformat()}] Collecting r/{ticker} posts…")

    # 투자 관련 서브레딧에서 검색 (limit=10개 포스트)
    submissions = reddit.subreddit("investing").search(
        query, sort="new", limit=10
    )

    for post in submissions:
        # 포스트 제목 + 본문
        text = f"{post.title}\n\n{post.selftext}"
        social_records.append({
            'id': sid,
            'platform': 'reddit',
            'text': text
        })
        sid += 1

        # 주요 댓글 상위 3개
        post.comments.replace_more(limit=0)
        for c in post.comments[:3]:
            social_records.append({
                'id': sid,
                'platform': 'reddit',
                'text': c.body
            })
            sid += 1

    # 지나친 요청 방지용 짧은 휴식
    time.sleep(2)

# DataFrame으로 변환 후 CSV 저장
df = pd.DataFrame(social_records)
df.to_csv('data/social_media.csv', index=False)

# === Fetch Financial Reports (Yahoo Finance summaries) ===
fin_records = []
fid = 1
for ticker in all_tickers:
    comp = yf.Ticker(ticker)
    fin = comp.financials.fillna(0)
    # convert yearly statement to text summary
    for year in fin.columns:
        summary = f"{ticker} Financials {year}: " + "; ".join([f"{idx}={val}" for idx, val in fin[year].items()])
        fin_records.append({'id': fid, 'report_text': summary})
        fid += 1
fin_df = pd.DataFrame(fin_records)
fin_df.to_csv('data/financial_reports.csv', index=False)

# === Fetch Macro Indicators (FRED series) ===
macro_series = {'CPI': 'CPIAUCSL', 'Unemployment Rate': 'UNRATE', 'Fed Funds Rate': 'FEDFUNDS'}
macro_recs = []
mid = 1
start_date = (datetime.now() - timedelta(days=365*3)).strftime('%Y-%m-%d')
for name, series in macro_series.items():
    data = fred.get_series(series, observation_start=start_date)
    for date, value in data.items():
        macro_recs.append({
            'id': mid,
            'indicator': name,
            'date': date.strftime('%Y-%m-%d'),
            'value': value
        })
        mid += 1
macro_df = pd.DataFrame(macro_recs)
macro_df.to_csv('data/macro_indicators.csv', index=False)

# === Fetch Sentiment Data (Google Trends) ===
senti_records = []
sent_id = 1

end_date   = datetime.now()
start_date = end_date - timedelta(days=800)
timeframe  = f"{start_date.strftime('%Y-%m-%d')} {end_date.strftime('%Y-%m-%d')}"
# 5개씩 배치
batches = [all_tickers[i:i+5] for i in range(0, len(all_tickers), 5)]

for batch in batches:
    kws = batch  # ex: ['NVDA','MSFT','AAPL','GOOGL','IBM']
    print(f"▶ Batch 요청: {kws}")

    success = False
    while not success:
        try:
            pytrends.build_payload(kws, timeframe=timeframe, geo='US')
            df = pytrends.interest_over_time()
            success = True
        except Exception as e:
            msg = str(e)
            if '429' in msg or 'rate' in msg.lower():
                wait_sec = 60
                print(f"  → 429 받음, {wait_sec}s 대기 후 재시도…")
                time.sleep(wait_sec)
            else:
                print("  → 다른 에러:", e)
                break

    if not success:
        # 이 배치는 스킵
        continue

    # 얻은 DataFrame: 인덱스가 날짜, 컬럼에 각 티커 관심도
    for date, row in df.iterrows():
        for ticker in kws:
            senti_records.append({
                'id':    sent_id,
                'topic': ticker,
                'score': int(row[ticker]),
                'date':  date.strftime('%Y-%m-%d')
            })
            sent_id += 1

    # 배치 간 슬립
    time.sleep(10)

# 결과 저장
senti_df = pd.DataFrame(senti_records)
senti_df.to_csv('data/sentiment_data.csv', index=False)

# === Fetch Price Time Series Data ===
price_records = []
pid = 1
for ticker in all_tickers:
    data = yf.download(ticker, period='2y', interval='1d', auto_adjust=False).reset_index()
    for _, row in data.iterrows():
        price_records.append({
            'id': pid,
            'ticker': ticker,
            'date': row['Date'][0].strftime('%Y-%m-%d'),
            'close': row['Close'][0],
            'volume': int(row['Volume'][0])
        })
        pid += 1
price_df = pd.DataFrame(price_records)
price_df.to_csv('data/price_time_series.csv', index=False)

print("CSV files generated in data/ directory.")