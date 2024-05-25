export default function LoadingIndicator() {
  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <img src="/img/loading.gif" alt="loading" style={{ width: '200px', height: '200px', position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -30%)' }} />
    </div>
  );
}