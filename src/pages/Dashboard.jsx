// src/pages/Dashboard.jsx
// Esqueleto — tela inicial após login: ver fichas existentes ou criar uma nova.

import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-xl font-semibold mb-1">Suas Fichas</h1>
        <p className="text-sm text-gray-500 mb-6">O que você quer fazer?</p>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => navigate('/characters')}
            className="text-left border rounded p-4 hover:bg-gray-50"
          >
            <div className="font-medium">Ver Personagens</div>
            <div className="text-sm text-gray-500">Abrir uma ficha já criada.</div>
          </button>

          <button
            onClick={() => navigate('/characters/new')}
            className="text-left border rounded p-4 hover:bg-gray-50"
          >
            <div className="font-medium">Criar Novo Personagem</div>
            <div className="text-sm text-gray-500">Começar o fluxo de criação de ficha.</div>
          </button>
        </div>
      </div>
    </div>
  );
}