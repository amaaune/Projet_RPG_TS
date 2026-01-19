import { Character } from "./Characters.ts";

export class Barbarian extends Character {
    berserk : number = 1.3;

    constructor(
  ) {
        super("Bogdan", 120, 80, 0, 80, 90, 120)
    }
    
}