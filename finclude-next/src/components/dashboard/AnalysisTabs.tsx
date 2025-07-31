import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { sampleResult } from "../../data/sampleResult";

const steps = [
  { key: "market_summary", label: "시장 조사 요약", desc: "다양한 데이터 기반 시장 동향 분석 (개인 투자 이력 반영)" },
  { key: "recommendations", label: "개인화 종목 추천", desc: "투자 이력/성향/선호 섹터 기반 AI 추천" },
  { key: "analysis_summary", label: "과거 분석", desc: "추천 종목의 과거 3개월 데이터 분석 (개인화 근거 포함)" },
  { key: "prediction", label: "미래 예측", desc: "개인화 기반 향후 3개월 전망" },
  { key: "final_strategy", label: "최종 전략", desc: "투자 성향/이력 반영 맞춤 전략" },
];

export default function AnalysisTabs() {
  return (
    <Tabs defaultValue="market_summary" className="w-full">
      <TabsList className="mb-4 flex flex-wrap">
        {steps.map((step) => (
          <TabsTrigger key={step.key} value={step.key} className="mr-2">
            {step.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {steps.map((step) => (
        <TabsContent key={step.key} value={step.key}>
          <Card>
            <CardHeader>
              <CardTitle>{step.label}</CardTitle>
              <div className="text-sm text-gray-500 mt-1">{step.desc}</div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-base">{sampleResult[step.key]}</pre>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
} 