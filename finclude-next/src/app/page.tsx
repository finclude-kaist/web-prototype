"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export default function Home() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/result?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 p-4">
      <Card className="w-full max-w-xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center mb-2">Finclude</CardTitle>
          <div className="text-center text-gray-600 text-base mb-2">
            <b>개인 맞춤형 RAG 기반 AI 주식 투자 자문 서비스</b>
          </div>
          <div className="text-center text-sm text-gray-500 mb-2">
            사용자의 투자 이력과 성향을 반영하여, 다양한 금융 데이터를 AI가 분석하고<br/>
            시장조사부터 종목추천, 과거분석, 미래예측, 투자전략까지<br/>
            단계별로 리포트 형태로 제공합니다.<br/>
            <span className="text-xs text-blue-700">네이버 클로바 × 미래에셋 챌린지 출품작</span>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="관심 시장/테마를 입력하세요 (예: AI, 전기차, 제약)"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <Button type="submit" className="w-full py-3 text-lg mt-2">분석 시작</Button>
            <div className="text-xs text-gray-400 text-center mt-2">
              예시: "AI 반도체 시장 전망", "전기차 관련 유망주 추천", "신재생에너지 투자 전략"
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 