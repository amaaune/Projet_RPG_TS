import { Character } from "../src/Characters.ts";

export class Mage extends Character {

  constructor() {
    super("sorcier", 40, 20, 120, 80, 70, 90);
  }

  fireball(target: Character): number {
    const rawDamage = (this.attackM - target.deffM) * 1.4;
    const damage = Math.max(rawDamage, 0);

    target.currentHp = Math.max(target.currentHp - damage, 0);
    return damage;
  }
}