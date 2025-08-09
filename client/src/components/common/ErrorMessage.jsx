export default function ErrorMessage({ error }) {
  if (!error) return null;
  return <div style={{ color: 'red', marginBottom: 16, textAlign: 'center' }}>{error}</div>;
}