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

    /** Attaque spéciale de zone: Morsure sauvage - frappe toute l'équipe */
    morsureSauvage(targets: Character[]): number {
        let totalDamage = 0;
        targets.forEach(target => {
            if (target.isAlive()) {
                const damage = Math.max(this.attack - target.defense, 0);
                target.currentHp = Math.max(target.currentHp - damage, 0);
                totalDamage += damage;
            }
        });
        return totalDamage;
    }

    /** IA du boss: 70% attaque normale (via random), 30% attaque de zone */
    atkRandom(targets: Character[]): { cible: Character | null, degats: number, attaqueZone: boolean } {
        const useZoneAttack = Math.random() < 0.3;
        
        if (useZoneAttack) {
            const degats = this.morsureSauvage(targets);
            return { cible: null, degats, attaqueZone: true };
        } else {
            const target = this.random(targets);
            if (!target) return { cible: null, degats: 0, attaqueZone: false };
            
            const damage = Math.max(this.attack - target.defense, 0);
            target.currentHp = Math.max(target.currentHp - damage, 0);
            return { cible: target, degats: damage, attaqueZone: false };
        }
    }
}
