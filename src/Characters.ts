export class Character {
  readonly name: string;
  readonly classe: string;
  readonly attack: number;    
  readonly defense: number;
  readonly speed: number;
  readonly maxHp: number;
  currentHp: number;
  readonly maxMp: number;
  currentMp: number;

  constructor(
    name: string,
    classe: string,
    attack: number,
    defense: number,
    speed: number,
    maxHp: number,
    maxMp: number = 0,
  ) {
    this.name = name;
    this.classe = classe;
    this.attack = attack;
    this.defense = defense;
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
