// src/pages/Register.jsx
// Registro — nome + foto (placeholder) + credenciais. Layout do mockup.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim() === '') {
      setError('Identificação do Agente é obrigatória.');
      return;
    }
    // TODO: trocar por supabase.auth.signUp({ email, password }) + salvar
    // nome/foto na tabela de perfil.
    onLogin({ name, email });
    navigate('/dashboard');
  }

  function handleCancel() {
    setName('');
    setEmail('');
    setPassword('');
    setError(null);
  }

  return (
    <div className="h-full flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="login-form-container">
        <div className="photo-placeholder">[ Arquivo de foto pendente ]</div>

        <div className="form-fields">
          <input
            type="text"
            required
            placeholder="Nome do agente"
            className="w-full mb-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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

          <button type="submit" className="w-full mb-2">
            Confirmar credenciais
          </button>
          <button type="button" onClick={handleCancel} className="w-full btn-secondary">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}