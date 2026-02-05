import { Character } from "../src/Characters.ts";

export class Thief extends Character {

  constructor() {
    super("Shade", 60, 40, 20, 30, 120, 90);
  }

  backstab(target: Character): number {
    const rawDamage = (this.attackP - target.deffP) * 1.6;
    const damage = Math.max(rawDamage, 0);

    target.currentHp = Math.max(target.currentHp - damage, 0);
    return damage;
  }
}