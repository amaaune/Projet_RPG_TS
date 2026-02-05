import { Character } from "../src/Characters.ts";

export class Barbarian extends Character {
  role: string = "gros dégâts, fragile";

  constructor(name: string) {
    super(name, "Barbarian", 28, 10, 11, 110);
  }

  
  berserkAttack(target: Character): number {
    const baseDamage = Math.max(this.attack - target.defense, 0);
    const damage = Math.floor(baseDamage * 1.3);

    target.currentHp = Math.max(target.currentHp - damage, 0);

    const recoil = Math.floor(this.maxHp * 0.2);
    this.currentHp = Math.max(this.currentHp - recoil, 0);

    return damage;
  }
}