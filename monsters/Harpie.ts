import { Monster } from "./Monsters.ts";

export class Harpie extends Monster {
    constructor() {
        super(
            "Harpie",
            "Créature volante",
            16,  // attack - modéré
            7,   // defense - faible
            18,  // speed - très rapide
            45   // maxHp - faible
        );
    }
}