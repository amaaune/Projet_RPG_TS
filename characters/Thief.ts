import { Character } from "../src/Characters.ts";

export class Thief extends Character {
  role: string = "rapide, utilitaire";

  constructor(name: string) {
    super(name, "Thief", 16, 14, 20, 100);
  }

  /** Vol d'objet */
  steal(): string {
    const r = Math.random();

    if (r < 0.4) return "Rien";
    if (r < 0.7) return "Potion";
    if (r < 0.85) return "Fragment d'étoile";
    if (r < 0.95) return "Éther";
    return "Demi-étoile";
  }
}