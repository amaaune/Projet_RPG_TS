import { Monster } from "./Monsters.ts";

export class Goblin extends Monster {
    constructor() {
        super(
            "Goblin",
            "Créature sournoise",
            12,  // attack - faible
            6,   // defense - très faible
            16,  // speed - rapide
            40   // maxHp - faible
        );
    }
}