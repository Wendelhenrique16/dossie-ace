// src/logic/classBonuses.js
import { CLASSES } from '../data/classes';

function mergeBonuses(target, source) {
  if (!source) return target;
  if (source.attributeBonuses) {
    Object.entries(source.attributeBonuses).forEach(([id, val]) => {
      target.attributeBonuses[id] = (target.attributeBonuses[id] || 0) + val;
    });
  }
  if (source.skillBonuses) {
    Object.entries(source.skillBonuses).forEach(([id, val]) => {
      target.skillBonuses[id] = (target.skillBonuses[id] || 0) + val;
    });
  }
  return target;
}

/**
 * Calcula os bônus totais de Atributo/Perícia vindos da Classe + Arquétipo.
 *
 * @param {string} classId
 * @param {string} archetypeId
 * @param {string} [weaponChoiceSkillId] - obrigatório só para classes com
 *   `skillChoice` (hoje, só Lutador: "Combate, Armas Brancas ou Armas de Fogo").
 */
export function calculateClassBonuses(classId, archetypeId, weaponChoiceSkillId) {
  const result = {
    attributeBonuses: {},
    skillBonuses: {},
    specialtyPoints: 0,
    notes: [],
  };

  const classData = CLASSES[classId];
  if (!classData) return result;

  mergeBonuses(result, classData.classBonus);
  result.specialtyPoints += classData.classBonus.specialtyPoints || 0;

  if (classData.classBonus.skillChoice) {
    const { options, amount } = classData.classBonus.skillChoice;
    if (weaponChoiceSkillId && options.includes(weaponChoiceSkillId)) {
      result.skillBonuses[weaponChoiceSkillId] =
        (result.skillBonuses[weaponChoiceSkillId] || 0) + amount;
    }
  }

  const archetype = classData.archetypes.find((a) => a.id === archetypeId);
  if (archetype) {
    mergeBonuses(result, archetype.bonus);
    if (archetype.note) result.notes.push(archetype.note);
  }

  return result;
}