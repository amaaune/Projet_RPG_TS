import { Character } from "../src/Characters.ts";

export class Mage extends Character {
  role: string = "damage dealer magique fragile";

  constructor(name: string) {
    super(
      name,
      10,  // attackP
      8,   // defenseP
      12,  // speed
      90,  // maxHp
      60   // maxMp
    );
  }

  /** Attaque magique qui consomme du mana et ignore 1.5x attaque */
  attackMagical(target: Character): number {
    const manaCost = 15;
    
    if (this.currentMp < manaCost) {
      return 0; // Pas assez de mana
    }

    this.currentMp -= manaCost;
    const damage = Math.floor(this.attackP * 1.5); // 15 dégâts garantis pour 10 attaque
    target.takeDamage(damage);
    return damage;
  }
}
