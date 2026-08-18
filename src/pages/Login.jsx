// src/pages/Login.jsx
// Esqueleto — sem integração real com Supabase Auth ainda.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: trocar por supabase.auth.signInWithPassword({ email, password })
    onLogin({ email });
    navigate('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border rounded p-6">
        <h1 className="text-lg font-semibold mb-1">Ficha ACE</h1>
        <p className="text-sm text-gray-500 mb-6">Entre para acessar suas fichas.</p>

        <label className="block text-sm mb-1">E-mail</label>
        <input
          type="email"
          required
          className="w-full border rounded px-3 py-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block text-sm mb-1">Senha</label>
        <input
          type="password"
          required
          className="w-full border rounded px-3 py-2 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="w-full py-2 rounded bg-gray-900 text-white text-sm">
          Entrar
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          Ainda sem cadastro real — qualquer e-mail/senha entra por enquanto.
        </p>
      </form>
    </div>
  );
}