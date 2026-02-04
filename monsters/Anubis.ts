import { Monster } from "./Monsters.ts";
import { Character } from "../src/Characters.ts";

export class Anubis extends Monster {
    constructor() {
        super(
            "Anubis, Gardien des Ombres",
            "Boss Divin",
            28,  // attack - attaque très puissante
            11,  // defense - défense modérée (réduit pour équilibrage)
            13,  // speed
            160, // maxHp - boss résistant
            30   // maxMp
        );
    }

    /** Attaque spéciale: Jugement divin - ignore 50% de la défense */
    jugementDivin(target: Character): number {
        const reducedDefense = Math.floor(target.defense * 0.5);
        const damage = Math.max(this.attack - reducedDefense, 0);
        target.currentHp = Math.max(target.currentHp - damage, 0);
        return damage;
    }
}
