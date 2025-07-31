# AI 주식 투자 자문 서비스

개인 맞춤형 RAG 기반 AI 주식 투자 자문 서비스입니다.

![AI Stock Advisor](https://img.shields.io/badge/AI-Stock%20Advisor-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3-38B2AC)

## 🚀 주요 기능

- **🤖 4단계 AI 에이전트 파이프라인**: 시장 조사 → 종목 추천 → 과거 분석 → 미래 예측
- **📊 개인화된 투자 자문**: 사용자의 투자 내역을 기반으로 맞춤형 추천
- **📈 실시간 데이터 분석**: 뉴스, 소셜미디어, 재무제표, 거시경제 지표 등 다양한 데이터 소스 활용
- **🎯 RAG 기반 정확성**: 벡터 데이터베이스를 활용한 정확한 정보 검색
- **💻 모던 웹 인터페이스**: 직관적이고 반응형 대시보드 UI

## 🛠 기술 스택

### Frontend
- **Next.js 14** - React 기반 풀스택 프레임워크
- **TypeScript** - 타입 안전성을 위한 정적 타입 언어
- **Tailwind CSS** - 유틸리티 우선 CSS 프레임워크
- **Lucide React** - 아이콘 라이브러리
- **Framer Motion** - 애니메이션 라이브러리

### Backend & AI
- **OpenAI GPT-4o-mini** - 대화형 AI 모델
- **LangChain** - AI 애플리케이션 개발 프레임워크
- **Qdrant** - 벡터 데이터베이스
- **Python** - 데이터 수집 및 처리

### Data Sources
- **News API** - 뉴스 기사 데이터
- **Reddit API** - 소셜미디어 데이터
- **Yahoo Finance** - 주가 및 재무 데이터
- **FRED API** - 거시경제 지표
- **Google Trends** - 검색 트렌드 데이터

## 📋 시작하기

### 사전 요구사항

- Node.js 18+ 
- Python 3.8+
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
```bash
git clone <repository-url>
cd ai-stock-advisor
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
cp .env.local.example .env.local
```

`.env.local` 파일을 편집하여 필요한 API 키를 설정하세요:
```env
OPENAI_API_KEY=your_openai_api_key
QDRANT_URL=http://localhost:6333
NEWSAPI_KEY=your_news_api_key
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
FRED_API_KEY=your_fred_api_key
```

4. **개발 서버 실행**
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 애플리케이션을 확인하세요.

## 📁 프로젝트 구조

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css        # 전역 스타일
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── page.tsx           # 메인 페이지
│   └── components/            # React 컴포넌트 (향후 확장)
├── scripts/                   # Python 스크립트
│   ├── agents_pipeline.py     # AI 에이전트 파이프라인
│   ├── get_data.py           # 데이터 수집
│   └── rag_db_setup.py       # RAG 데이터베이스 설정
├── public/                    # 정적 파일
├── package.json              # Node.js 의존성
├── tailwind.config.js        # Tailwind CSS 설정
├── tsconfig.json             # TypeScript 설정
└── README.md                 # 프로젝트 문서
```

## 🤖 AI 에이전트 파이프라인

### 1단계: 시장 조사 에이전트
- 다양한 데이터 소스에서 관련 정보 수집
- RAG 기반으로 정확한 시장 동향 분석
- 출처와 함께 종합적인 시장 인사이트 제공

### 2단계: 종목 추천 에이전트
- 시장 조사 결과와 사용자 투자 성향 분석
- 상승/하락 예상 종목 리스트 생성
- 각 추천에 대한 구체적인 근거 제시

### 3단계: 과거 분석 에이전트
- 추천 종목들의 과거 주가 및 거래량 데이터 분석
- 시장 동향과 실제 주가 변동의 상관관계 분석
- 패턴 인식을 통한 투자 인사이트 도출

### 4단계: 미래 예측 에이전트
- 과거 분석 결과를 바탕으로 향후 3개월 성과 예측
- 투자 우선순위 및 리스크 평가
- 구체적인 투자 전략 및 포트폴리오 제안

## 📊 지원하는 종목

### AI 관련 주식
- NVDA, MSFT, AAPL, GOOGL, IBM, AMD, INTC

### 신재생 에너지
- TSLA, ENPH, FSLR, BE, RUN, SPWR, PLUG

### 제약/바이오
- JNJ, PFE, MRK, BNTX, GILD, REGN, AMGN

## 🔮 향후 계획

- [ ] 실시간 API 연동 (현재는 데모 데이터 사용)
- [ ] 사용자 인증 및 개인 포트폴리오 관리
- [ ] 실시간 주가 차트 및 기술적 분석
- [ ] 더 많은 종목 및 시장 지원
- [ ] 모바일 앱 개발
- [ ] 한국어 번역 기능
- [ ] HyperClova 연동

## 👥 팀 정보

- **팀명**: Finclude (KAIST)
- **팀원**: 김환, 김지혁, 원대한

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 문의

프로젝트에 대한 질문이나 제안사항이 있으시면 언제든 연락주세요.

---

**Made with ❤️ by Finclude Team**