import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { userProfile } from "../../data/userProfile";

export default function InvestmentHistoryTable() {
  return (
    <Table className="w-full text-sm">
      <TableHeader>
        <TableRow>
          <TableHead>종목</TableHead>
          <TableHead>이름</TableHead>
          <TableHead>매수/매도</TableHead>
          <TableHead>날짜</TableHead>
          <TableHead>금액(USD)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userProfile.investmentHistory.map((item, idx) => (
          <TableRow key={idx}>
            <TableCell>{item.ticker}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.action}</TableCell>
            <TableCell>{item.date}</TableCell>
            <TableCell>{item.amount.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 