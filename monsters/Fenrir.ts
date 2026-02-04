import { Monster } from "./Monsters.ts";
import { Character } from "../src/Characters.ts";

export class Fenrir extends Monster {
    constructor() {
        super(
            "Fenrir, Loup Ancestral",
            "Boss Bestial",
            25,  // attack - forte attaque
            11,  // defense - défense modérée (réduit pour équilibrage)
            18,  // speed - extrêmement rapide
            100  // maxHp
        );
    }

    /** Attaque spéciale: Morsure sauvage - peut attaquer 2 fois */
    morsureSauvage(targets: Character[]): number {
        const aliveTargets = targets.filter(t => t.isAlive());
        if (aliveTargets.length === 0) return 0;

        let totalDamage = 0;
        const attackCount = Math.random() > 0.5 ? 2 : 1; // 50% de chance d'attaquer 2 fois

        for (let i = 0; i < attackCount; i++) {
            const target = aliveTargets[Math.floor(Math.random() * aliveTargets.length)];
            const damage = Math.max(this.attack - target.defense, 0);
            target.currentHp = Math.max(target.currentHp - damage, 0);
            totalDamage += damage;
        }

        return totalDamage;
    }
}
