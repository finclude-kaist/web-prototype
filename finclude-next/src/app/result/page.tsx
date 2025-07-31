import React from "react";
import UserProfileCard from "../../components/dashboard/UserProfileCard";
import InvestmentHistoryTable from "../../components/dashboard/InvestmentHistoryTable";
import AnalysisTabs from "../../components/dashboard/AnalysisTabs";

export default function ResultPage() {
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-7xl mx-auto">
      {/* 좌측: 사용자 정보/투자 이력 */}
      <aside className="md:w-1/3 w-full">
        <UserProfileCard />
        <div className="mt-4">
          <h3 className="font-semibold mb-2">투자 이력</h3>
          <InvestmentHistoryTable />
        </div>
      </aside>
      {/* 우측: 분석 결과 */}
      <main className="md:w-2/3 w-full">
        <AnalysisTabs />
      </main>
    </div>
  );
} 