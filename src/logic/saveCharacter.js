// src/logic/saveCharacter.js
import { supabase } from '../lib/supabase';

/**
 * Salva (cria ou atualiza) uma ficha na tabela `characters`.
 * @param {string} userId
 * @param {object} character - o objeto de estado inteiro do personagem
 * @param {string} [characterId] - se vier, faz UPDATE; senão, INSERT
 */
export async function saveCharacterToSupabase(userId, character, characterId) {
  const payload = {
    user_id: userId,
    name: character.name || '(sem nome)',
    data: character,
  };

  if (characterId) {
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
}