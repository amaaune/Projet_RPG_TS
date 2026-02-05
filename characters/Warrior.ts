import { Character } from "../src/Characters.ts";

export class Warrior extends Character {
  role: string = "tank offensif";

  constructor(name: string) {
    super(name, "Warrior", 22, 20, 10, 130);
  }

  /** Attaque physique simple */
  attackPhysical(target: Character): number {
    const damage = Math.max(this.attack - target.defense, 0);
    target.currentHp = Math.max(target.currentHp - damage, 0);
    return damage;
  }
}