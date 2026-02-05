import { Character } from "../src/Characters.ts";

export class Paladin extends Character {
  role: string = "tank/support hybride";

  constructor(name: string) {
    super(name, "Paladin", 18, 22, 9, 120);
  }


  holyAttack(targets: Character[]): number {
    let total = 0;

    for (const target of targets) {
      const base = Math.max(this.attack - target.defense, 0);
      const damage = Math.floor(base * 0.4);
      target.currentHp = Math.max(target.currentHp - damage, 0);
      total += damage;
    }

    return total;
  }
}