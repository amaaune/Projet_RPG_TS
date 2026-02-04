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
}
