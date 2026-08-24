// src/pages/CharacterList.jsx
// Lista real de fichas do usuário logado, via Supabase.

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listCharacters } from '../logic/saveCharacter';

export default function CharacterList({ userId }) {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    listCharacters(userId).then(({ data, error: fetchError }) => {
      if (fetchError) {
        setError(fetchError.message);
      } else {
        setCharacters(data ?? []);
      }
      setIsLoading(false);
    });
  }, [userId]);

  function handleOpenCharacter(character) {
    // TODO: quando existir a tela de visualização/edição de ficha existente,
    // trocar por navigate(`/characters/${character.id}`).
    console.log('Abrir personagem:', character);
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <button onClick={() => navigate('/dashboard')} className="text-sm mb-4 self-start px-3 py-1.5">
        ← Voltar
      </button>

      <h1 className="text-xl font-semibold mb-4">Personagens</h1>

      {isLoading && <p className="text-sm opacity-60">Carregando...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="agents-grid">
          {characters.map((char) => (
            <button key={char.id} onClick={() => handleOpenCharacter(char)} className="agent-card">
              <div className="agent-photo-sim">👤</div>
              <div className="agent-name">{char.name}</div>
              <div className="text-xs opacity-60 mt-1">
                {new Date(char.updated_at).toLocaleDateString('pt-BR')}
              </div>
            </button>
          ))}
        </div>
      )}

      {!isLoading && !error && characters.length === 0 && (
        <p className="text-sm opacity-60">Nenhum personagem criado ainda.</p>
      )}
    </div>
  );
}