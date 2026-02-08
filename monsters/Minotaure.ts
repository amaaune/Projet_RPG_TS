import { Monster } from "./Monsters.ts";

export class Minotaure extends Monster {
    constructor() {
        super(
            "Minotaure",
            "Bête légendaire",
            20,  // attack - élevé
            11,  // defense - élevée
            9,   // speed - très lent
            70   // maxHp - élevé
        );
    }
}