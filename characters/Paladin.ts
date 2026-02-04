import { Character } from "../src/Characters.ts";

export class Paladin extends Character {
  role: string = "tank/support hybride";
  
  constructor(name: string) {
    super(
      name,
      "Paladin",
      22,  // attack - attaque moins élevée que le guerrier
      24,  // defense - défense légèrement plus élevée
      10,  // speed
      120  // maxHp
    );
  }

  /** Attaque sainte : (attaque - défense adverse) * 0.4 sur tous les ennemis */
  holyAttack(targets: Character[]): number {
    let totalDamage = 0;

    for (const target of targets) {
      const baseDamage = Math.max(this.attack - target.defense, 0);
      const damage = Math.floor(baseDamage * 0.4);
      target.currentHp = Math.max(target.currentHp - damage, 0);
      totalDamage += damage;
    }

    return totalDamage;
  }
}