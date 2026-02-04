export class Character {
  name: string;
  attackP: number;
  defenseP: number;
  attackM: number;
  defenseM: number;
  speed: number;
  maxHp: number;
  currentHp: number;
  maxMp: number;
  currentMp: number;

  constructor(
    name: string,
    attackP: number,
    defenseP: number,
    attackM: number,
    defenseM: number,
    speed: number,
    maxHp: number,
    maxMp: number = 0,
  ) {
    this.name = name;
    this.attackP = attackP;
    this.defenseP = defenseP;
    this.attackM = attackM;
    this.defenseM = defenseM;
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
