'use client'

import { useState } from 'react'

export default function Home() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI 주식 투자 자문 서비스
          </h1>
          <p className="text-xl text-gray-600">
            개인 맞춤형 RAG 기반 4단계 에이전트 분석
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">투자 질문하기</h2>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
            >
              {isLoading ? '분석 중...' : 'AI 분석 시작'}
            </button>
          </form>
        </div>

        {results && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">
                1단계: 시장 조사 결과
              </h3>
              <div className="text-gray-700 whitespace-pre-line">
                {results.market_summary}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-600">
                2단계: 종목 추천
              </h3>
              <div className="text-gray-700 whitespace-pre-line">
                {results.recommendations}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-600">
                3단계: 과거 데이터 분석
              </h3>
              <div className="text-gray-700 whitespace-pre-line">
                {results.analysis_summary}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-orange-600">
                4단계: 미래 예측
              </h3>
              <div className="text-gray-700 whitespace-pre-line">
                {results.prediction}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}