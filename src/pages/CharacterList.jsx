// src/pages/CharacterList.jsx
// Esqueleto — lista de fichas já criadas, com dados fake por enquanto.
// TODO: trocar PLACEHOLDER_CHARACTERS por fetch real no Supabase
// (tabela "characters", filtrando por user_id).

import { useNavigate } from 'react-router-dom';

const PLACEHOLDER_CHARACTERS = [
  { id: '1', name: 'Personagem Exemplo 1', role: 'agente', concept: 'Ex-militar recrutado pela ACE.' },
  { id: '2', name: 'Personagem Exemplo 2', role: 'civil', concept: 'Estudante que viu algo que não devia.' },
  { id: '3', name: 'Personagem Exemplo 3', role: 'agente', concept: 'Ocultista à beira da loucura.' },
];

export default function CharacterList() {
  const navigate = useNavigate();

  function handleOpenCharacter(character) {
    // TODO: quando existir a rota/tela de visualização de ficha existente,
    // trocar por navigate(`/characters/${character.id}`).
    console.log('Abrir personagem:', character);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-gray-500 mb-4">
          ← Voltar
        </button>

        <h1 className="text-xl font-semibold mb-4">Personagens</h1>

        <div className="grid grid-cols-1 gap-3">
          {PLACEHOLDER_CHARACTERS.map((char) => (
            <button
              key={char.id}
              onClick={() => handleOpenCharacter(char)}
              className="text-left border rounded p-4 bg-white hover:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{char.name}</span>
                <span className="text-xs text-gray-400 capitalize">{char.role}</span>
              </div>
              <div className="text-sm text-gray-500">{char.concept}</div>
            </button>
          ))}
        </div>

        {PLACEHOLDER_CHARACTERS.length === 0 && (
          <p className="text-sm text-gray-400">Nenhum personagem criado ainda.</p>
        )}
      </div>
    </div>
  );
}