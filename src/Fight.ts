import { Character } from "./Characters.ts";

export class Fight {

    players : Character[];
    monsters : Character[];
    allFighters : Character[];

    constructor(players : Character[], monsters : Character[]) {
        this.players = players;
        this.monsters = monsters;

        this.allFighters = [...players, ...monsters];
    }


    initiative(character : Character[]) : Character[] {    
        return character.sort((a, b) => b.speed - a.speed);
    }
}