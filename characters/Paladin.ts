import { Character } from "../src/Characters.ts";

export class Paladin extends Character {
  role: string = "tank/support hybride";
  
  constructor(name: string) {
    super(
      name,
      18,  // attackP
      22,  // defenseP
      9,   // speed
      120  // maxHp
    );
  }

  holyAttack(targets: Character[]): number {
    let totalDamage = 0;

    for (const target of targets) {
      const damage = Math.max((this.attackP - target.defenseP) * 0.4, 0);
      target.takeDamage(damage);
      totalDamage += damage;
    }

    return totalDamage;
  }
}
