// src/pages/Register.jsx
// Registro — nome + foto (placeholder) + credenciais. Layout do mockup.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BureaucraticLoader from '../components/BureaucraticLoader';

export default function Register({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim() === '') {
      setError('Identificação do Agente é obrigatória.');
      return;
    }
    // TODO: trocar por supabase.auth.signUp({ email, password }) + salvar
    // nome/foto na tabela de perfil.
    setIsProcessing(true);
  }

  function handleLoaderComplete() {
    setIsProcessing(false);
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
          <div className="input-group mb-3">
            <input
              type="text"
              required
              placeholder="Nome do agente"
              className="w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <span className="block-cursor" />
          </div>
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

          <button type="submit" className="w-full mb-2">
            Confirmar credenciais
          </button>
          <button type="button" onClick={handleCancel} className="w-full btn-secondary">
            Cancelar
          </button>
        </div>
      </form>

      <BureaucraticLoader isOpen={isProcessing} onComplete={handleLoaderComplete} />
    </div>
  );
}