import { Character } from "../src/Characters.ts";

export class Monster extends Character{

  random(targets : Character[]) {
    const aliveTarget = targets.filter(t => t.isAlive());
    if (aliveTarget.length === 0)
        return null;

    if (Math.random() <= 0.2) {
        const minHp = Math.min(...aliveTarget.map(t => t.currentHp));
        const weakest = aliveTarget.filter(t => t.currentHp === minHp);

        return weakest[Math.floor(Math.random() * weakest.length)];
    }
    return aliveTarget[Math.floor(Math.random() * aliveTarget.length)];
  }

}