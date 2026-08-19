// src/components/AppHeader.jsx
import { useNavigate } from 'react-router-dom';

export default function AppHeader({ userName }) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="user-info">
        <div className="user-icon">👤</div>
        {userName ? (
          <span>{`AGENTE: ${userName.toUpperCase()}`}</span>
        ) : (
          <button onClick={() => navigate('/auth')} className="header-login-link">
            Login Requerido
          </button>
        )}
      </div>
      <div className="ace-logo-container">
        <div className="ace-title">ACE</div>
        <div className="ace-logo-icon">🜘</div>
      </div>
    </header>
  );
}