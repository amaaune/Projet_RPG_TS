import { Character } from "../src/Characters.ts";

export class Mage extends Character {
  role: string = "damage dealer magique fragile";

  constructor(name: string) {
    super(
      name,
      "Mage",
      13,  // attack - attaque de base faible
      8,   // defense - défense faible
      12,  // speed
      90,  // maxHp
      60   // maxMp
    );
  }

  /** Attaque magique qui consomme du mana et ignore la défense */
  attackMagical(target: Character): number {
    const manaCost = 10;
    
    if (this.currentMp < manaCost) {
      return 0; // Pas assez de mana
    }

    this.currentMp -= manaCost;
    // Attaque magique puissante qui ignore la défense ennemie
    const damage = 25; // Dégâts fixes puissants
    target.currentHp = Math.max(target.currentHp - damage, 0);
    return damage;
  }
}