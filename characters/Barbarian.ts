import { Character } from "./Characters.ts";

export class Barbarian extends Character {
    berserkA : number = 1.3;

    constructor(
  ) {
        super("Bogdan", 120, 80, 0, 80, 90, 120)
    }

    berserk(target : Character) : number {
        const rawDamage = (this.attackP - target.deffP)*1.3;
        const damage = Math.max(rawDamage, 0);

        target.currentHp = Math.max(target.currentHp - damage, 0);
        return damage;
    }
}