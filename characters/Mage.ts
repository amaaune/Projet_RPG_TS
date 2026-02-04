import { Player } from "./Player.ts";
import { Character } from "../src/Characters.ts";
// import { InputHandler } from "../src/InputHandler.ts";

export class Mage extends Player {
  role: string = "damage dealer magique fragile";

  constructor(name: string) {
    super(
      name,
      10,  // attackP
      8,   // defenseP
      20,  // attackM
      12,  // defenseM
      12,  // speed
      90,  // maxHp
    );
    this.maxMp = 60;
    this.currentMp = 60;
  }

  async takeTurn(
    allCharacters: Character[],
    allies: Character[],
    enemies: Character[]
  ): Promise<{ attacker: Character; action: string; target?: Character; damage?: number }> {
    // Le mage attaque magiquement le premier ennemi
    const target = enemies[0];
    if (target) {
      const damage = this.attackMagical(target);
      console.log(
        `✨ ${this.name} attaque magiquement ${target.name} pour ${damage} dégâts!`
      );
      return { attacker: this, action: `a attaqué magiquement ${target.name}`, target, damage };
    }
    return { attacker: this, action: "attend" };
  }

  /** Attaque magique qui consomme du mana et ignore 1.5x attaque */
  attackMagical(target: Character): number {
    const manaCost = 15;
    
    if (this.currentMp < manaCost) {
      return 0; // Pas assez de mana
    }

    this.currentMp -= manaCost;
    const damage = Math.floor(this.attackP * 1.5); // 15 dégâts garantis pour 10 attaque
    target.takeDamage(damage);
    return damage;
  }
}
