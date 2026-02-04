import { Character } from "../src/Characters.ts";

export class Priest extends Character {
  role: string = "healer";
  
  constructor(name: string) {
    super(
      name,
      12,  // attackP
      10,  // defenseP
      10,  // speed
      95,  // maxHp
      50   // maxMp
    );
  }

  //soin
  healAlly(target: Character): number {
    const healAmount = Math.floor(target.maxHp * 0.25);
    target.currentHp = Math.min(target.currentHp + healAmount, target.maxHp);
    return healAmount;
  }
}
