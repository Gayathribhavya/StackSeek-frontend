import { Link } from "react-router-dom";

export default function SimpleLanding() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <img 
          src="/sidebar-minimized-logo.png" 
          alt="Logo" 
          style={{ width: '48px', height: '48px', objectFit: 'contain' }} 
        />
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#1d4ed8', margin: 0 }}>StackSeek</h1>
      </div>
      <p style={{ fontSize: '18px', marginBottom: '24px' }}>Error Analysis Made Simple</p>
      <div style={{ display: 'flex', gap: '16px' }}>
        <Link to="/login" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none' }}>
          Sign In
        </Link>
        <Link to="/register" style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 16px', borderRadius: '4px', textDecoration: 'none' }}>
          Get Started
        </Link>
      </div>
    </div>
  );
}
