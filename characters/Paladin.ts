import { Player } from "./Player.ts";
import { Character } from "../src/Characters.ts";
// import { InputHandler } from "../src/InputHandler.ts";

export class Paladin extends Player {
  role: string = "tank/support hybride";
  
  constructor(name: string) {
    super(
      name,
      18,  // attackP
      22,  // defenseP
      12,  // attackM
      10,  // defenseM
      9,   // speed
      120  // maxHp
    );
  }

  async takeTurn(
    allCharacters: Character[],
    allies: Character[],
    enemies: Character[]
  ): Promise<{ attacker: Character; action: string; target?: Character; damage?: number }> {
    // Le paladin attaque l'ennemi
    const target = enemies[0];
    if (target) {
      const damage = this.attackPhysical(target);
      console.log(
        `⚔️ ${this.name} attaque avec fierté ${target.name} pour ${damage} dégâts!`
      );
      return { attacker: this, action: `a attaqué ${target.name}`, target, damage };
    }
    return { attacker: this, action: "attend" };
  }

  /** Paladin attaque *0.4 (40%) */
  holyAttack(targets: Character[]): number {
    let totalDamage = 0;

    for (const target of targets) {
      const damage = Math.max((this.attackP - target.defenseP) * 0.4, 0);
      target.takeDamage(damage);
      totalDamage += damage;
    }

    return totalDamage;
  }
}
