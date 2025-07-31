import { useSearchParams, useRouter } from 'next/navigation';
import StepCard from '../../components/StepCard';
import sampleResult from '../../data/sampleResult.json';

const steps = [
  { title: '시장 조사 요약', key: 'market_summary', desc: '최신 뉴스, 소셜, 거시지표 등 다양한 데이터를 기반으로 한 시장 동향 요약' },
  { title: '개인화 종목 추천', key: 'recommendations', desc: '사용자 투자 이력/성향을 반영한 AI 종목 추천 및 근거' },
  { title: '과거 분석', key: 'analysis_summary', desc: '추천 종목의 최근 3개월간 가격/거래량 등 과거 데이터 분석' },
  { title: '미래 예측', key: 'prediction', desc: '향후 3개월간 AI 기반 가격 전망 및 주요 변수' },
  { title: '최종 투자 전략', key: 'final_strategy', desc: '매수/매도 타이밍, 포트폴리오 분산, 수익률 등 투자 실행 전략' }
];

export default function ResultPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('query') || '';
  const result = sampleResult as any;

  return (
    <main style={{ maxWidth: 800, margin: 'auto', padding: 32 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 8 }}>Finclude 분석 결과</h1>
      <p style={{ color: '#888', textAlign: 'center', marginBottom: 32 }}>
        입력한 시장/테마: <b>{query}</b>
      </p>
      {steps.map((step, idx) => (
        <StepCard key={step.key} step={idx+1} title={step.title} desc={step.desc} content={result[step.key]} />
      ))}
      <button onClick={() => router.push('/')} style={{ marginTop: 32, width: '100%', padding: 16, fontSize: 18, borderRadius: 8, background: '#eee', color: '#222', border: 'none' }}>
        처음으로
      </button>
    </main>
  );
} 