"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/result?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <main style={{ maxWidth: 600, margin: 'auto', padding: 32 }}>
      <img src="/logo.svg" alt="Finclude" style={{ width: 120, margin: '32px auto', display: 'block' }} />
      <h1 style={{ textAlign: 'center', marginBottom: 8 }}>Finclude</h1>
      <p style={{ textAlign: 'center', color: '#444', marginBottom: 32 }}>
        <b>개인 맞춤형 RAG 기반 AI 주식 투자 자문 서비스</b><br/>
        사용자의 투자 이력과 성향을 반영하여, 다양한 금융 데이터를 AI가 분석하고<br/>
        시장조사부터 종목추천, 과거분석, 미래예측, 투자전략까지<br/>
        단계별로 리포트 형태로 제공합니다.<br/>
        <span style={{ color: '#888', fontSize: 14 }}>
          네이버 클로바 × 미래에셋 챌린지 출품작
        </span>
      </p>
      <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
        <input
          type="text"
          placeholder="관심 시장/테마를 입력하세요 (예: AI, 전기차, 제약)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ width: '100%', padding: 12, fontSize: 18, borderRadius: 8, border: '1px solid #ccc' }}
          required
        />
        <button type="submit" style={{ marginTop: 24, width: '100%', padding: 16, fontSize: 18, borderRadius: 8, background: '#1a237e', color: 'white', border: 'none' }}>
          분석 시작
        </button>
      </form>
    </main>
  );
}
