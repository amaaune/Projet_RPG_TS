import { Character } from "../src/Characters.ts";

export class Warrior extends Character {

  constructor() {
    super("Ragnar", 90, 110, 20, 60, 70, 150);
  }

  shieldBash(target: Character): number {
    const rawDamage = (this.attackP - target.deffP) * 1.1;
    const damage = Math.max(rawDamage, 0);

    target.currentHp = Math.max(target.currentHp - damage, 0);
    return damage;
  }
}