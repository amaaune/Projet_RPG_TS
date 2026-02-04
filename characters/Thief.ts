import { Character } from "../src/Characters.ts";

export class Thief extends Character {
  role: string = "rapide, utilitaire";
  
  constructor(name: string) {
    super(
      name,
      16,  // attackP
      14,  // defenseP
      20,  // speed - le plus rapide du jeu
      100  // maxHp
    );
  }

  /** Vol d'objet */
  steal(): string {
    const random = Math.random();

    if (random < 0.4) {
      return "Rien"; // 40% de chances
    } else if (random < 0.7) {
      return "Potion"; // 30%
    } else if (random < 0.85) {
      return "Fragment d'étoile"; // 15%
    } else if (random < 0.95) {
      return "Éther"; // 10%
    } else {
      return "Demi-étoile"; // 5%
    }
  }
}
