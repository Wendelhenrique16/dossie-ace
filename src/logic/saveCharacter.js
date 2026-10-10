// src/logic/saveCharacter.js
import { supabase } from '../lib/supabase';
import { normalizeCharacter } from './characterNormalizer';
/**
 * Salva (cria ou atualiza) uma ficha na tabela `characters`.
 * @param {string} userId
 * @param {object} character - o objeto de estado inteiro do personagem
 * @param {string} [characterId] - se vier, faz UPDATE; senão, INSERT
 */
export async function saveCharacterToSupabase(userId, character, characterId, expectedUpdatedAt = null) {
  const payload = {
    user_id: userId,
    name: character.name || '(sem nome)',
    data: character,
    updated_at: new Date().toISOString(),
  };

  if (characterId) {
    // Evita sobrescrever alterações feitas em outro aparelho desde que esta ficha foi aberta.
    if (expectedUpdatedAt) {
      const { data: current, error: readError } = await supabase
        .from('characters')
        .select('updated_at')
        .eq('id', characterId)
        .single();
      if (readError) return { data: null, error: readError };
      if (current.updated_at !== expectedUpdatedAt) {
        return {
          data: null,
          error: {
            code: 'CONFLICT',
            message:
              'Esta ficha foi alterada em outro aparelho desde que você a abriu. Salvar agora apagaria essa versão. Copie o que precisar, recarregue a página (isso descarta as alterações deste aparelho) e refaça.',
          },
        };
      }
    }
    return supabase.from('characters').update(payload).eq('id', characterId).select().single();
  }
  return supabase.from('characters').insert(payload).select().single();
}

/**
 * Lista as fichas do usuário logado (id + nome + updated_at, sem o JSON
 * inteiro, pra listagem ser leve).
 */
export async function listCharacters(userId) {
  return supabase
    .from('characters')
    .select('id, name, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
}

/**
 * Carrega uma ficha completa pelo id.
 */
export async function loadCharacter(characterId) {
  return supabase.from('characters').select('*').eq('id', characterId).single();
}// Compara objetos ignorando a ordem das chaves (o jsonb do Postgres reordena).
function stableStringify(v) {
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(',')}]`;
  if (v && typeof v === 'object') {
    return `{${Object.keys(v)
      .filter((k) => v[k] !== undefined)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableStringify(v[k])}`)
      .join(',')}}`;
  }
  return JSON.stringify(v);
}

/**
 * Relê a ficha no banco e compara com a que está na tela.
 * Retorna { ok, updatedAt, reason }.
 */
export async function verifySavedCharacter(characterId, character) {
  const { data, error } = await supabase
    .from('characters')
    .select('data, updated_at')
    .eq('id', characterId)
    .single();
  if (error) return { ok: false, updatedAt: null, reason: `Não consegui reler a ficha no banco: ${error.message}` };
  const same = stableStringify(normalizeCharacter(data.data)) === stableStringify(normalizeCharacter(character));
  return {
    ok: same,
    updatedAt: data.updated_at,
    reason: same ? null : 'A tela e o banco têm versões diferentes da ficha.',
  };
}