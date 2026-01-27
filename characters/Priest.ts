import { Character } from "../src/Characters.ts";

export class Priest extends Character {
    
  /** Soigne un pourcentage de la vie max */
  heal(percent : number) : number {
    if (!this.isAlive()) return 0;

    const healAmount = Math.floor(this.maxHp * percent);
    const before = this.currentHp;

    this.currentHp = Math.min(this.currentHp + healAmount, this.maxHp);
    return this.currentHp - before;
  }
}