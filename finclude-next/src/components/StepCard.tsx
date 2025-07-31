type Props = { step: number, title: string, desc: string, content: string };
export default function StepCard({ step, title, desc, content }: Props) {
  return (
    <section style={{
      border: '1px solid #eee', borderRadius: 12, margin: '24px 0', padding: 24, background: '#fafbfc'
    }}>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>STEP {step}. {title}</h2>
      <div style={{ color: '#888', marginBottom: 12 }}>{desc}</div>
      <pre style={{ whiteSpace: 'pre-wrap', fontSize: 16, background: 'none', margin: 0 }}>{content}</pre>
    </section>
  );
} 