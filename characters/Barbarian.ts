import { Character } from "../src/Characters.ts";

export class Barbarian extends Character {
  role: string = "gros dégâts, fragile";
  
  constructor(name: string) {
    super(
      name,
      "Barbarian",
      28,  // attack - attaque plus élevée que le guerrier
      8,   // defense - défense faible
      11,  // speed
      110  // maxHp
    );
  }

  /** Berserk: (attaque - défense) * 1.3 mais auto-dégâts 20% PV max */
  berserkAttack(target: Character): number {
      const baseDamage = Math.max(this.attack - target.defense, 0);
      const damage = Math.floor(baseDamage * 1.3);
      
      target.currentHp = Math.max(target.currentHp - damage, 0);
      
      // Le barbare se blesse
      this.currentHp = Math.max(this.currentHp - Math.floor(this.maxHp * 0.2), 0);
      console.log(`${this.name} subit des dégâts de contre-coup en utilisant Berserk!`);
      return damage;
    }
}
