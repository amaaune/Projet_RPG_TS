import { Monster } from "./Monsters.ts";

export class Orc extends Monster {
    constructor() {
        super(
            "Orc Guerrier",
            "Combattant brutal",
            18,  // attack - modéré
            9,   // defense - modérée
            10,  // speed - lent
            60   // maxHp - modéré
        );
    }
}