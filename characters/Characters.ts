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
  /** Soigne un pourcentage de la vie max */
  heal(percent : number) : number {
    if (!this.isAlive()) return 0;

    const healAmount = Math.floor(this.maxHp * percent);
    const before = this.currentHp;

    this.currentHp = Math.min(this.currentHp + healAmount, this.maxHp);
    return this.currentHp - before;
  }

  /** Ressuscite avec un pourcentage de la vie max */
  resurrect(percent : number) : boolean {
    if (this.isAlive()) return false;

    this.currentHp = Math.max(Math.floor(this.maxHp * percent), 1);
    return true;
  }

}