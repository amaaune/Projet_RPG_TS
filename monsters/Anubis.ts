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
            160  // maxHp - boss résistant
        );
    }

    /** Attaque spéciale de zone: Jugement divin - frappe toute l'équipe */
    jugementDivin(targets: Character[]): number {
        let totalDamage = 0;
        targets.forEach(target => {
            if (target.isAlive()) {
                const reducedDefense = Math.floor(target.defense * 0.5);
                const damage = Math.max(this.attack - reducedDefense, 0);
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
            const degats = this.jugementDivin(targets);
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
