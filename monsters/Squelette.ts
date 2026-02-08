import { Monster } from "./Monsters.ts";

export class Squelette extends Monster {
    constructor() {
        super(
            "Squelette Guerrier",
            "Mort-vivant",
            14,  // attack - faible
            10,  // defense - élevée pour sa catégorie
            12,  // speed - moyen
            50   // maxHp - faible-moyen
        );
    }
}