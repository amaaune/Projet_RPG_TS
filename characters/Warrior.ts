import { Character } from "../src/Characters.ts";

export class Warrior extends Character {
  role: string = "tank offensif";
  
  constructor(name: string) {
    super(
      name,
      "Warrior",
      26,  // attack - attaque élevée
      20,  // defense - défense élevée
      11,  // speed - vitesse moyenne
      130  // maxHp
    );
  }

  /** Attaque physique simple du guerrier */
  attackPhysical(target: Character): number {
    const damage = Math.max(this.attack - target.defense, 0);
    target.currentHp = Math.max(target.currentHp - damage, 0);
    return damage;
  }
}
