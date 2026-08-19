// src/components/AppHeader.jsx
export default function AppHeader({ userName }) {
  return (
    <header className="app-header">
      <div className="user-info">
        <div className="user-icon">👤</div>
        <span>{userName ? `AGENTE: ${userName.toUpperCase()}` : 'LOGIN REQUERIDO'}</span>
      </div>
      <div className="ace-logo-container">
        <div className="ace-title">ACE</div>
        <div className="ace-logo-icon">🜘</div>
      </div>
    </header>
  );
}