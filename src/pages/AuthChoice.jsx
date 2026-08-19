// src/pages/AuthChoice.jsx
import { useNavigate } from 'react-router-dom';

export default function AuthChoice() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="menu-box">
        <button onClick={() => navigate('/login')}>Fazer Login</button>
        <button onClick={() => navigate('/register')}>Registrar Agente</button>
      </div>
    </div>
  );
}