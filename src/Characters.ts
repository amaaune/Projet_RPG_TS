export class Character {
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

}