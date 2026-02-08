import { Character } from "../src/Characters.ts";

export class Priest extends Character {
  role: string = "healer";
  
  constructor(name: string) {
    super(
      name,
      "Priest",
      16,  // attack - légèrement plus forte que le mage
      8,   // defense - défense faible
      10,  // speed
      95   // maxHp - pas de mana pour le Prêtre
    );
  }

  /** Soin */
  healAlly(target: Character): number {
    const healAmount = Math.floor(target.maxHp * 0.25);
    target.currentHp = Math.min(target.currentHp + healAmount, target.maxHp);
    return healAmount;
  }
}
