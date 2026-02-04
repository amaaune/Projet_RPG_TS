export class Character {
  name: string;
  attackM: number;
  defenseM: number;
  attackP: number;
  defenseP: number;
  speed: number;
  maxHp: number;
  currentHp: number;
  maxMp: number;
  currentMp: number;

  constructor(
    name: string,
    attackM: number,
    defenseM: number,
    attackP: number,
    defenseP: number,
    speed: number,
    maxHp: number,
    maxMp: number = 0,
  ) {
    this.name = name;
    this.attackM = attackM;
    this.defenseM = defenseM;
    this.attackP = attackP;
    this.defenseP = defenseP;
    this.speed = speed;
    this.maxHp = maxHp;
    this.currentHp = maxHp;
    this.maxMp = maxMp;
    this.currentMp = maxMp;
  }

  /** Vérifie si le personnage est vivant */
  isAlive(): boolean {
    return this.currentHp > 0;
  }

  /** Blesse le personnage d'une certaine quantité */
  takeDamage(damage: number): void {
    this.currentHp = Math.max(this.currentHp - damage, 0);
  }

  /** Soigne le personnage d'un pourcentage */
  heal(percent: number): void {
    const healAmount = Math.floor(this.maxHp * percent);
    this.currentHp = Math.min(this.currentHp + healAmount, this.maxHp);
  }

  /** Ressuscite avec un pourcentage de la vie max */
  resurrect(percent: number): boolean {
    if (this.isAlive()) return false;
    this.currentHp = Math.max(Math.floor(this.maxHp * percent), 1);
    return true;
  }
}