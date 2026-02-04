import { Character } from "../src/Characters.ts";

export class Player extends Character {
    
  inventory: string[];

  constructor(name: string, attackP: number, defenseP: number, attackM: number, defenseM: number, speed: number, maxHp: number) {
    super(name, attackP, defenseP, attackM, defenseM, speed, maxHp);
    this.inventory = [];
  }

  /** Attaque physique */
  attackPhysical(target: Character): number {
    const damage = Math.max(this.attackP - target.defenseP, 0);
    target.currentHp = Math.max(target.currentHp - damage, 0);
    return damage;
  }

  /** Attaque magique */
  attackMagical(target: Character): number {
    const damage = Math.max(this.attackM - target.defenseM, 0);
    target.currentHp = Math.max(target.currentHp - damage, 0);
    return damage;
  }

  /** Utilise un objet de l'inventaire */
  useItem(itemName: string): boolean {
    const index = this.inventory.indexOf(itemName);
    if (index > -1) {
      this.inventory.splice(index, 1);
      return true;
    }
    return false;
  }

  /** Ressuscite avec un pourcentage de la vie max */
  resurrect(percent: number): boolean {
    if (this.isAlive()) return false;

    this.currentHp = Math.max(Math.floor(this.maxHp * percent), 1);
    return true;
  }

  /** Récupère l'inventaire */
  getInventory(): string[] {
    return this.inventory;
  }
}