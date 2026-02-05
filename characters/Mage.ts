import { Character } from "../src/Characters.ts";

export class Mage extends Character {
  role: string = "damage dealer magique fragile";

  constructor(name: string) {
    super(name, "Mage", 10, 8, 12, 90, 60);
  }


  magicAttack(target: Character): number {
    const manaCost = 15;

    if (this.currentMp < manaCost) {
      return 0;
    }

    this.currentMp -= manaCost;

    const damage = Math.floor(this.attack * 1.5);
    target.currentHp = Math.max(target.currentHp - damage, 0);

    return damage;
  }
}