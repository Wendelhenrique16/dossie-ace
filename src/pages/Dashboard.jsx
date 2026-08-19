// src/pages/Dashboard.jsx
// Tela inicial — pública. Não exige login pra ser vista; só as ações de
// "Ver Personagens" / "Criar Novo" pedem login (via RequireAuth na rota).

import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="menu-box">
        <button onClick={() => navigate('/characters')}>Ver Personagens</button>
        <button onClick={() => navigate('/characters/new')}>Criar Novo Personagem</button>
      </div>
    </div>
  );
}