'use client'

import { useState } from 'react'
import { TrendingUp, Brain, BarChart3, Search, User, Settings, ChevronRight, Star, AlertTriangle, TrendingDown } from 'lucide-react'

interface AnalysisResult {
  market_summary: string
  recommendations: string
  analysis_summary: string
  prediction: string
}

// 더미 데이터 (기존 Python 코드의 결과를 모방)
const mockAnalysis: AnalysisResult = {
  market_summary: `### 주요 시장 동향 분석

**AI 기술 관련 주식 시장 현황:**

1. **NVIDIA (NVDA)**: AI 칩 시장의 선두주자로서 강력한 성장세를 보이고 있습니다. 최근 데이터센터와 AI 인프라 수요 증가로 인해 주가가 상승 추세입니다.

2. **Microsoft (MSFT)**: OpenAI와의 파트너십을 통해 AI 분야에서 적극적인 투자를 진행하고 있으며, Azure 클라우드 서비스와 AI 통합으로 성장 동력을 확보했습니다.

3. **Google (GOOGL)**: Bard와 Gemini AI 모델 개발에 대규모 투자를 진행하고 있으며, 검색과 광고 분야에서의 AI 활용도가 높아지고 있습니다.

**시장 전망**: AI 관련 주식들은 지속적인 기술 발전과 시장 확대로 인해 중장기적으로 긍정적인 전망을 보이고 있습니다.`,

  recommendations: `### 추천 종목 리스트

**상승 예상 종목:**

1. **NVIDIA (NVDA)** ⭐⭐⭐⭐⭐
   - 이유: AI 칩 시장 독점적 지위, 데이터센터 수요 급증
   - 목표가: 현재 대비 15-20% 상승 예상

2. **Microsoft (MSFT)** ⭐⭐⭐⭐
   - 이유: AI 통합 서비스 확장, 클라우드 시장 점유율 증가
   - 목표가: 현재 대비 10-15% 상승 예상

3. **Advanced Micro Devices (AMD)** ⭐⭐⭐
   - 이유: AI 칩 시장 진입, NVIDIA 대안으로 주목
   - 목표가: 현재 대비 8-12% 상승 예상

**주의 종목:**

1. **Apple (AAPL)** ⚠️
   - 이유: AI 분야 상대적 후발주자, 혁신 속도 우려
   - 전망: 단기적으로 횡보 또는 소폭 하락 가능성`,

  analysis_summary: `### 과거 데이터 분석 결과

**최근 1개월 주가 변동 분석:**

1. **NVIDIA**: +16.3% 상승 (139.99 → 162.88)
   - 거래량: 높은 수준 유지 (투자자 관심 증가)
   - 기술적 분석: 상승 모멘텀 지속

2. **Microsoft**: 안정적 상승세
   - AI 관련 발표와 실적 개선으로 긍정적 반응
   - 기관 투자자들의 지속적 매수세

3. **AMD**: 변동성 존재하지만 상승 기조
   - 반도체 업계 특성상 주기적 변동성
   - AI 칩 시장 진입으로 장기적 성장 동력 확보

**상관관계 분석**: 
AI 관련 뉴스와 기업 실적 발표가 주가에 직접적인 영향을 미치고 있으며, 시장 전체적으로 AI 테마에 대한 긍정적 반응이 지속되고 있습니다.`,

  prediction: `### 향후 3개월 예측 및 투자 순위

**투자 우선순위:**

1. **NVIDIA (NVDA)** 🥇
   - 예상 수익률: +18-25%
   - 근거: AI 칩 수요 지속 증가, 신제품 출시 예정
   - 리스크: 높은 밸류에이션, 시장 조정 가능성

2. **Microsoft (MSFT)** 🥈
   - 예상 수익률: +12-18%
   - 근거: AI 서비스 확산, 안정적 수익 모델
   - 리스크: 낮음, 방어적 성격

3. **Google (GOOGL)** 🥉
   - 예상 수익률: +10-15%
   - 근거: AI 검색 통합, 광고 수익 개선
   - 리스크: 중간, 경쟁 심화

4. **AMD** 
   - 예상 수익률: +8-15%
   - 근거: 시장 점유율 확대 가능성
   - 리스크: 높음, 경쟁 치열

**투자 전략 제안:**
- 포트폴리오의 30-40%를 AI 관련 주식에 배분
- NVIDIA와 Microsoft를 핵심 보유 종목으로 설정
- 분할 매수를 통한 리스크 관리 권장`
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('analysis')
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // 실제 API 호출 대신 더미 데이터 사용
    setTimeout(() => {
      setResults(mockAnalysis)
      setIsLoading(false)
    }, 2000)
  }

  const menuItems = [
    { id: 'analysis', label: 'AI 분석', icon: Brain, color: 'text-blue-600' },
    { id: 'portfolio', label: '포트폴리오', icon: User, color: 'text-green-600' },
    { id: 'market', label: '시장 현황', icon: TrendingUp, color: 'text-purple-600' },
    { id: 'settings', label: '설정', icon: Settings, color: 'text-gray-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-8 h-8 text-primary-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Stock Advisor</h2>
                <p className="text-xs text-gray-500">Finclude (KAIST)</p>
              </div>
            </div>
          </div>
          
          <nav className="mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-all duration-200 ${
                    isActive 
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              )
            })}
          </nav>

          {/* User Portfolio Summary */}
          <div className="mt-8 mx-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">내 포트폴리오</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">AAPL</span>
                <span className="text-green-600">+2.3%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">TSLA</span>
                <span className="text-red-600">-1.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GOOG</span>
                <span className="text-green-600">+0.8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    개인 맞춤형 AI 주식 투자 자문
                  </h1>
                  <p className="text-gray-600">RAG 기반 4단계 에이전트 분석</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Brain className="w-4 h-4" />
                  <span>GPT-4o-mini 기반</span>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-6 overflow-auto">
            {activeTab === 'analysis' && (
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Query Form */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Search className="w-5 h-5 mr-2 text-primary-600" />
                    투자 질문하기
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        어떤 주식에 대해 알고 싶으신가요?
                      </label>
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="예: AI 기술 관련 주식 추천해줘"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>AI 분석 중...</span>
                        </>
                      ) : (
                        <>
                          <Brain className="w-5 h-5" />
                          <span>AI 분석 시작</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* Analysis Steps */}
                {results && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Step 1: Market Research */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-600">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-bold">1</span>
                        </div>
                        시장 조사 결과
                      </h3>
                      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {results.market_summary}
                      </div>
                    </div>

                    {/* Step 2: Recommendations */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-green-600">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-green-600 font-bold">2</span>
                        </div>
                        종목 추천
                      </h3>
                      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {results.recommendations}
                      </div>
                    </div>

                    {/* Step 3: Historical Analysis */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-purple-600">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-purple-600 font-bold">3</span>
                        </div>
                        과거 데이터 분석
                      </h3>
                      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {results.analysis_summary}
                      </div>
                    </div>

                    {/* Step 4: Future Prediction */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center text-orange-600">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-orange-600 font-bold">4</span>
                        </div>
                        미래 예측
                      </h3>
                      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                        {results.prediction}
                      </div>
                    </div>
                  </div>
                )}

                {/* Feature Overview */}
                {!results && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <Brain className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">시장 조사</h3>
                      <p className="text-sm text-gray-600">다양한 데이터 소스를 활용한 종합적 시장 분석</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <Star className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">종목 추천</h3>
                      <p className="text-sm text-gray-600">개인 투자 성향을 반영한 맞춤형 종목 추천</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">과거 분석</h3>
                      <p className="text-sm text-gray-600">역사적 데이터를 통한 패턴 및 상관관계 분석</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                        <TrendingUp className="w-6 h-6 text-orange-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">미래 예측</h3>
                      <p className="text-sm text-gray-600">AI 기반 향후 주가 움직임 예측 및 투자 전략</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-green-600" />
                    내 포트폴리오
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium text-green-800">총 자산</h4>
                        <p className="text-2xl font-bold text-green-900">$32,500</p>
                        <p className="text-sm text-green-600">+5.2% 이번 달</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-800">보유 종목</h4>
                        <p className="text-2xl font-bold text-blue-900">5개</p>
                        <p className="text-sm text-blue-600">AI, 테크 중심</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-medium text-purple-800">현금 비율</h4>
                        <p className="text-2xl font-bold text-purple-900">15%</p>
                        <p className="text-sm text-purple-600">투자 대기</p>
                      </div>
                    </div>
                    <p className="text-gray-600">포트폴리오 상세 기능은 곧 출시됩니다.</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'market' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                    시장 현황
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-800">S&P 500</h4>
                      <p className="text-xl font-bold text-green-900">4,567.23</p>
                      <p className="text-sm text-green-600">+1.2%</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-blue-800">NASDAQ</h4>
                      <p className="text-xl font-bold text-blue-900">14,234.56</p>
                      <p className="text-sm text-blue-600">+2.1%</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-800">DOW</h4>
                      <p className="text-xl font-bold text-red-900">34,567.89</p>
                      <p className="text-sm text-red-600">-0.3%</p>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-800">VIX</h4>
                      <p className="text-xl font-bold text-yellow-900">18.45</p>
                      <p className="text-sm text-yellow-600">-2.1%</p>
                    </div>
                  </div>
                  <p className="text-gray-600">실시간 차트 및 상세 분석 기능은 곧 출시됩니다.</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-gray-600" />
                    설정
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">투자 성향</h4>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500">
                        <option>보수적</option>
                        <option>중립적</option>
                        <option selected>공격적</option>
                      </select>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">관심 섹터</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">AI/기술</span>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">신재생에너지</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">바이오/제약</span>
                      </div>
                    </div>
                    <p className="text-gray-600">추가 설정 기능은 곧 출시됩니다.</p>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}