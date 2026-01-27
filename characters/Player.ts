import { Character } from "../src/Characters.ts";


export class player extends Character {
    
    inventoru : string[];

  /** Attaque physique */
  attackPhysical(target : Character) : number {
    const rawDamage = this.attackP - target.deffP;
    const damage = Math.max(rawDamage, 0);

    target.currentHp = Math.max(target.currentHp - damage, 0);
    return damage;
  }

  /** Attaque magique */
  attackMagical(target : Character) : number {
    const rawDamage = this.attackM - target.deffM;
    const damage = Math.max(rawDamage, 0);

    target.currentHp = Math.max(target.currentHp - damage, 0);
    return damage;
  }

  useItem() {

  }

  /** Ressuscite avec un pourcentage de la vie max */
  resurrect(percent : number) : boolean {
    if (this.isAlive()) return false;

    this.currentHp = Math.max(Math.floor(this.maxHp * percent), 1);
    return true;
  }

  getInventory() {
    // check si item existe, slotitems 
  }
}