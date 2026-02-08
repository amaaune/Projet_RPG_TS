import { Monster } from "./Monsters.ts";
import { Character } from "../src/Characters.ts";

export class Meduse extends Monster {
    constructor() {
        super(
            "Méduse, Reine Gorgone",
            "Boss Magique",
            26,  // attack - attaque puissante
            10,  // defense - défense faible (réduit pour équilibrage)
            14,  // speed
            130  // maxHp
        );
    }

    /** Attaque spéciale: Regard pétrifiant - ignore partiellement la défense */
    regardPetrifiant(target: Character): number {
        // Ignore 30% de la défense
        const reducedDefense = Math.floor(target.defense * 0.7);
        const damage = Math.max(this.attack - reducedDefense, 0);
        target.currentHp = Math.max(target.currentHp - damage, 0);
        return damage;
    }

    /** Attaque de zone: Serpents venimeux - frappe toute l'équipe */
    serpentsVenimeux(targets: Character[]): number {
        let totalDamage = 0;
        targets.forEach(target => {
            if (target.isAlive()) {
                const damage = Math.floor((this.attack - target.defense) * 0.6);
                const finalDamage = Math.max(damage, 0);
                target.currentHp = Math.max(target.currentHp - finalDamage, 0);
                totalDamage += finalDamage;
            }
        });
        return totalDamage;
    }

    /** IA du boss: 70% attaque normale (via random), 30% attaque de zone */
    atkRandom(targets: Character[]): { cible: Character | null, degats: number, attaqueZone: boolean } {
        const useZoneAttack = Math.random() < 0.3;
        
        if (useZoneAttack) {
            const degats = this.serpentsVenimeux(targets);
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
