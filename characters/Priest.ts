import { Character } from "../src/Characters.ts";

export class Priest extends Character {
  role: string = "healer";

  constructor(name: string) {
    super(name, "Priest", 12, 10, 10, 95, 50);
  }

  
  healAlly(target: Character): number {
    const heal = Math.floor(target.maxHp * 0.25);
    target.currentHp = Math.min(target.currentHp + heal, target.maxHp);
    return heal;
  }
}