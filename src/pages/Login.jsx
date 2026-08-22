// src/pages/Login.jsx
// Login "de verdade" — só credenciais, sem nome/foto (isso é o Registro).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BureaucraticLoader from '../components/BureaucraticLoader';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      setError('E-mail e senha são obrigatórios.');
      return;
    }
    // TODO: trocar por supabase.auth.signInWithPassword({ email, password })
    // O nome do agente viria da conta já registrada (tabela profiles/users).
    setIsProcessing(true);
  }

  function handleLoaderComplete() {
    setIsProcessing(false);
    onLogin({ email });
    navigate('/dashboard');
  }

  return (
    <div className="h-full flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="border p-6 w-full max-w-sm">
        <input
          type="email"
          required
          placeholder="E-mail operacional"
          className="w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Senha de acesso"
          className="w-full mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

        <button type="submit" className="w-full mt-2">
          Entrar
        </button>

        <button type="button" onClick={() => navigate('/register')} className="w-full mt-2 btn-secondary">
          Ainda não tenho conta
        </button>
      </form>

      <BureaucraticLoader isOpen={isProcessing} onComplete={handleLoaderComplete} />
    </div>
  );
}