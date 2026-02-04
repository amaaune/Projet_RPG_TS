import { Character } from "../src/Characters.ts";

export class Barbarian extends Character {
  role: string = "gros dégâts, fragile";
  
  constructor(name: string) {
    super(
      name,
      28,  // attackP
      10,  // defenseP
      11,  // speed
      110  // maxHp
    );
  }

  /** Berserk: (attaque - défense) * 1.3 mais auto-dégâts 20% PV max */
  berserkAttack(target: Character): number {
    const baseDamage = Math.max(this.attackP - target.defenseP, 0);
    const damage = Math.floor(baseDamage * 1.3);
    
    target.takeDamage(damage);
    
    // Le barbare se blesse
    const selfDamage = Math.floor(this.maxHp * 0.2);
    this.takeDamage(selfDamage);

    return damage;
  }
}