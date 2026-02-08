import { Character } from "./Characters.ts";

export class Fight {
    private readonly players: Character[];
    private readonly monsters: Character[];
    readonly allFighters: Character[];

    constructor(players : Character[], monsters : Character[]) {
        this.players = players;
        this.monsters = monsters;

        this.allFighters = [...players, ...monsters];
    }


    initiative(allFighters : Character[]) : Character[] {    
        return allFighters.sort((a, b) => b.speed - a.speed);
    }
}
