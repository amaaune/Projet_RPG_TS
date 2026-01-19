import { Character } from "../characters/Characters.ts";

export class Monster {
    name : string;
    attackP : number;
    deffP : number;
    attackM : number;
    deffM : number;
    speed : number;
    maxHp : number;
    currentHp : number;

     constructor(
    name: string,
    attackP: number,
    deffP: number,
    attackM: number,
    deffM: number,
    speed: number,
    maxHp: number,
  ) {
    this.name = name;
    this.attackP = attackP;
    this.deffP = deffP;
    this.attackM = attackM;
    this.deffM = deffM;
    this.speed = speed;
    this.maxHp = maxHp;
    this.currentHp = maxHp;
  }
  /** Vérifie si le personnage est vivant */
  isAlive() : boolean {
    return this.currentHp > 0;
  }

//   aoe(target : Character[]) : number {

//   }

  random(targets : Character) {
    const aliveTarget = targets.filter(t => t.isAlive());
    if (aliveTarget.length === 0)
        return null;

    if (Math.random() <= 0.2) {
        const minHp = Math.min(...aliveTarget.map(t => t.currentHp));
        const weakest = aliveTarget.filter(t => t,this.currentHp === minHp);

        return weakest[Math.floor(Math.random() * weakest.length)];
    }
    return aliveTarget[Math.floor(Math.random() * aliveTarget.length)];
  }

}