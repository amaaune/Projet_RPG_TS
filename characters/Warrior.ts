import { Character } from "../src/Characters.ts";

export class Warrior extends Character {
  role: string = "tank offensif";
  
  constructor(name: string) {
    super(
      name,
      22,  // attackP
      20,  // defenseP
      10,  // speed
      130  // maxHp
    );
  }

  /** Attaque physique simple du guerrier */
  attackPhysical(target: Character): number {
    const damage = Math.max(this.attackP - target.defenseP, 0);
    target.takeDamage(damage);
    return damage;
  }
}
