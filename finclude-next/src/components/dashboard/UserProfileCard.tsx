import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { userProfile } from "../../data/userProfile";

export default function UserProfileCard() {
  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>사용자 프로필</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-sm">
          <div><b>이름:</b> {userProfile.name}</div>
          <div><b>투자 성향:</b> {userProfile.riskTolerance}</div>
          <div><b>투자 기간:</b> {userProfile.investmentHorizon}</div>
          <div><b>선호 섹터:</b> {userProfile.preferredSectors.join(", ")}</div>
        </div>
      </CardContent>
    </Card>
  );
} 