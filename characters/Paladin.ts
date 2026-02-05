import { Character } from "../src/Characters.ts";

export class Paladin extends Character {

  constructor() {
    super("Thorian", 80, 100, 40, 90, 60, 140);
  }

  holyStrike(target: Character): number {
    const rawDamage = (this.attackP - target.deffP) * 1.2;
    const damage = Math.max(rawDamage, 0);

    target.currentHp = Math.max(target.currentHp - damage, 0);
    return damage;
  }
}