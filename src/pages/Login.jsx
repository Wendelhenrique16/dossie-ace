// src/pages/Login.jsx
// Login real via Supabase Auth (e-mail/senha).

import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import BureaucraticLoader from '../components/BureaucraticLoader';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const authPromiseRef = useRef(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      setError('E-mail e senha são obrigatórios.');
      return;
    }
    setError(null);
    // Dispara a chamada real e a burocracia falsa em paralelo — o que
    // demorar mais é quem manda no tempo total (ver handleLoaderComplete).
    authPromiseRef.current = supabase.auth.signInWithPassword({ email, password });
    setIsProcessing(true);
  }

  async function handleLoaderComplete() {
    const result = await authPromiseRef.current;
    setIsProcessing(false);
    if (result?.error) {
      setError(result.error.message);
    } else {
      navigate('/dashboard');
    }
  }

  return (
    <div className="h-full flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="border p-6 w-full max-w-sm">
        <div className="input-group mb-3">
          <input
            type="email"
            required
            placeholder="E-mail operacional"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="block-cursor" />
        </div>
        <div className="input-group mb-2">
          <input
            type="password"
            required
            placeholder="Senha de acesso"
            className="w-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="block-cursor" />
        </div>

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