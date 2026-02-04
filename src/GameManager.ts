import { Character } from "./Characters.ts";
import { Monster } from "../monsters/Monsters.ts";
import { Fight } from "./Fight.ts";
import { Fenrir } from "../monsters/Fenrir.ts";
import { Meduse } from "../monsters/Meduse.ts";
import { Anubis } from "../monsters/Anubis.ts";

// Types d'objets utilisables
type ObjetType = "Potion" | "Morceau d'étoile" | "Demi-étoile" | "Ether";

interface Objet {
    nom: ObjetType;
    icone: string;
    quantite: number;
}

export class GameManager {
    private equipe: Character[];
    private salleActuelle: number = 0;
    private readonly NOMBRE_SALLES: number = 5;
    private readonly SALLES_TRESOR: number[] = [2, 4]; // Salles au trésor
    private tourActuel: number = 0;
    private tresors: string[] = []; // Trésor collectés (équipements)
    private inventaire: Objet[] = []; // Objets consommables
    private cooldowns: Map<Character, number> = new Map(); // Cooldown des compétences

    constructor(equipe: Character[]) {
        this.equipe = equipe;
        // Initialiser les cooldowns à 0
        equipe.forEach(perso => this.cooldowns.set(perso, 0));
        // Initialiser l'inventaire avec quelques objets de départ
        this.ajouterObjet("Potion", 3);
    }

    /** Ajoute un objet à l'inventaire */
    private ajouterObjet(nom: ObjetType, quantite: number = 1): void {
        const icones: Record<ObjetType, string> = {
            "Potion": "🧪",
            "Morceau d'étoile": "✨",
            "Demi-étoile": "🌟",
            "Ether": "💊"
        };

        const existant = this.inventaire.find(obj => obj.nom === nom);
        if (existant) {
            existant.quantite += quantite;
        } else {
            this.inventaire.push({
                nom,
                icone: icones[nom],
                quantite
            });
        }
    }

    /** Lance l'exploration du donjon */
    public async lancerExploration(): Promise<boolean> {
        console.log("\n🗺️  Vous entrez dans le donjon...\n");
        await this.pause(2000);

        for (this.salleActuelle = 1; this.salleActuelle <= this.NOMBRE_SALLES; this.salleActuelle++) {
            console.clear();
            console.log("╔════════════════════════════════╗");
            console.log(`║  SALLE ${this.salleActuelle}/${this.NOMBRE_SALLES}                    ║`);
            console.log("╚════════════════════════════════╝\n");

            // Vérifier si c'est une salle au trésor
            if (this.SALLES_TRESOR.includes(this.salleActuelle)) {
                await this.salleAuTresor();
            } else {
                // Salle de combat
                const monstre = this.genererMonstre();
                console.log(`⚔️  Un ${monstre.name} apparaît !\n`);
                
                // Demander le mode de combat avec validation
                let modeAuto = false;
                let choixValide = false;
                
                while (!choixValide) {
                    console.log("Comment voulez-vous combattre ?");
                    console.log("1. Combat Manuel (vous choisissez chaque action)");
                    console.log("2. Combat Automatique (l'IA joue pour vous)");
                    
                    const choixMode = prompt("\nVotre choix (1 ou 2) : ");
                    
                    if (choixMode === "1") {
                        modeAuto = false;
                        choixValide = true;
                    } else if (choixMode === "2") {
                        modeAuto = true;
                        choixValide = true;
                    } else {
                        console.log("\n❌ Choix invalide. Veuillez choisir 1 ou 2.\n");
                    }
                }

                // Lancer le combat
                const victoire = await this.lancerCombat(monstre, modeAuto);

                if (!victoire) {
                    // Défaite - l'équipe est morte
                    this.afficherDefaite();
                    return false;
                }

                // Victoire de la salle
                this.afficherVictoireSalle();
                await this.pause(2000);
            }

            // Vérifier si c'était la dernière salle
            if (this.salleActuelle === this.NOMBRE_SALLES) {
                this.afficherVictoireFinale();
                return true;
            }

            // Menu de repos entre les salles
            await this.menuRepos();
        }

        return true;
    }

    /** Lance un combat entre l'équipe et un monstre */
    private async lancerCombat(monstre: Monster, modeAuto: boolean = false): Promise<boolean> {
        const combat = new Fight(this.equipe, [monstre]);
        const ordre = combat.initiative(combat.allFighters);
        
        this.tourActuel = 0;

        while (true) {
            this.tourActuel++;
            console.clear();
            console.log(`\n╔═══════════════ TOUR ${this.tourActuel} ═══════════════╗\n`);
            
            // Afficher l'état du combat
            this.afficherEtatCombat(monstre);
            await this.pause(1000);

            // Chaque combattant attaque selon l'ordre d'initiative
            for (const combattant of ordre) {
                // Vérifier si le combattant est vivant
                if (!combattant.isAlive()) {
                    continue;
                }

                // Déterminer si c'est un joueur ou un monstre
                const estJoueur = this.equipe.includes(combattant);

                if (estJoueur) {
                    if (modeAuto) {
                        // Mode automatique : l'IA choisit
                        await this.tourJoueurAuto(combattant, monstre);
                    } else {
                        // Mode manuel : le joueur choisit
                        await this.tourJoueur(combattant, monstre);
                    }
                } else {
                    // Le monstre attaque automatiquement
                    await this.attaqueMonstre(monstre as Monster, this.equipe);
                    await this.pause(1500);
                }

                // Vérifier les morts après chaque attaque
                if (!monstre.isAlive()) {
                    console.log(`\n🎉 Victoire ! ${monstre.name} a été vaincu !\n`);
                    await this.pause(2000);
                    return true;
                }

                if (!this.equipeEnVie()) {
                    return false;
                }
            }

            if (!modeAuto) {
                prompt("\n[Appuyez sur Entrée pour le prochain tour]");
            } else {
                await this.pause(1500);
            }
        }
    }

    /** Tour automatique pour l'IA */
    private async tourJoueurAuto(joueur: Character, monstre: Monster): Promise<void> {
        console.log(`\n━━━ Tour de ${joueur.name} (AUTO) ━━━`);
        
        const cooldown = this.cooldowns.get(joueur) || 0;
        
        // Logique de décision de l'IA
        let action: number;
        
        // Vérifier si un allié est en danger critique (< 30% HP) et qu'on a une potion
        const allieCritique = this.equipe.find(p => p.isAlive() && (p.currentHp / p.maxHp) < 0.3);
        const aPotion = this.inventaire.find(obj => obj.nom === "Potion" && obj.quantite > 0);
        
        if (allieCritique && aPotion) {
            // Utiliser une potion sur l'allié critique
            console.log(`${joueur.name} utilise une Potion sur ${allieCritique.name}`);
            const resultat = this.utiliserObjet("Potion", allieCritique);
            console.log(`   ${resultat}`);
            aPotion.quantite--;
            if (aPotion.quantite <= 0) {
                this.inventaire = this.inventaire.filter(obj => obj !== aPotion);
            }
            return;
        }
        
        // Si Priest et un allié est blessé (< 50% HP), soigner
        if (joueur.classe === "Priest") {
            const allieBlessé = this.equipe.find(p => p.isAlive() && (p.currentHp / p.maxHp) < 0.5);
            if (allieBlessé && cooldown === 0) {
                action = 3; // Compétence spéciale (soin)
            } else {
                action = 1; // Attaque de base
            }
        } else if (joueur.classe === "Mage") {
            // Mage utilise sa compétence magique si assez de MP
            if (joueur.currentMp >= 10 && cooldown === 0 && Math.random() < 0.5) {
                action = 3; // Compétence spéciale (attaque magique)
            } else {
                action = 1; // Attaque de base
            }
        } else {
            // Utiliser la compétence spéciale si disponible (30% de chance)
            if (cooldown === 0 && Math.random() < 0.3) {
                action = 3;
            } else {
                action = 1; // Attaque de base
            }
        }
        
        // Exécuter l'action
        await this.pause(500);
        
        switch (action) {
            case 1:
                console.log(`${joueur.name} utilise Attaque de Base`);
                await this.attaqueDeBase(joueur, monstre);
                break;
            case 3:
                if (cooldown > 0) {
                    console.log(`${joueur.name} utilise Attaque de Base (cooldown)`);
                    await this.attaqueDeBase(joueur, monstre);
                } else {
                    console.log(`${joueur.name} utilise Compétence Spéciale`);
                    await this.competenceSpeciale(joueur, monstre);
                    this.cooldowns.set(joueur, 2);
                }
                break;
        }
        
        // Réduire le cooldown de 1 tour
        if (cooldown > 0) {
            this.cooldowns.set(joueur, cooldown - 1);
        }
    }

    /** Gère le tour d'un joueur (choix manuel) */
    private async tourJoueur(joueur: Character, monstre: Monster): Promise<void> {
        console.log(`\n━━━ Tour de ${joueur.name} ━━━`);
        
        const cooldown = this.cooldowns.get(joueur) || 0;
        
        console.log("\nActions disponibles :");
        console.log("1. Attaque de Base");
        
        if (cooldown > 0) {
            console.log(`2. Compétence Spéciale (Cooldown: ${cooldown} tours)`);
        } else {
            console.log("2. Compétence Spéciale (Prête !)");
        }
        
        console.log("3. Utiliser un objet de l'inventaire");
        
        const choix = prompt(`\nChoisissez une action (1-3) : `);
        
        switch (choix) {
            case "1":
                await this.attaqueDeBase(joueur, monstre);
                break;
            case "2":
                if (cooldown > 0) {
                    console.log(`\n⏳ Compétence en cooldown ! Attaque de base à la place.`);
                    await this.attaqueDeBase(joueur, monstre);
                } else {
                    await this.competenceSpeciale(joueur, monstre);
                    this.cooldowns.set(joueur, 2);
                }
                break;
            case "3":
                await this.utiliserObjetCombat();
                break;
            default:
                console.log("\n❌ Choix invalide. Attaque de base par défaut.");
                await this.attaqueDeBase(joueur, monstre);
        }
        
        // Réduire le cooldown de 1 tour
        if (cooldown > 0) {
            this.cooldowns.set(joueur, cooldown - 1);
        }
    }

    /** Attaque de base */
    private async attaqueDeBase(joueur: Character, monstre: Monster): Promise<void> {
        let degats = 0;
        
        // Vérifier si le personnage a une méthode attackPhysical spécifique
        if ('attackPhysical' in joueur && typeof (joueur as any).attackPhysical === 'function') {
            degats = (joueur as any).attackPhysical(monstre);
        } else {
            // Attaque de base par défaut
            degats = Math.max(joueur.attack - monstre.defense, 0);
            monstre.currentHp = Math.max(monstre.currentHp - degats, 0);
        }
        
        console.log(`\n⚔️  ${joueur.name} attaque ${monstre.name} → ${degats} dégâts`);
        
        if (!monstre.isAlive()) {
            console.log(`💀 ${monstre.name} est vaincu !`);
        }
    }

    /** Compétence spéciale (utilise les méthodes des classes) */
    private async competenceSpeciale(joueur: Character, monstre: Monster): Promise<void> {
        // Cas spécial pour le Priest : soigner au lieu d'attaquer
        if (joueur.classe === "Priest") {
            // Trouver l'allié avec le moins de HP (en pourcentage)
            const alliesVivants = this.equipe.filter(p => p.isAlive());
            
            if (alliesVivants.length === 0) return;
            
            // Trouver l'allié le plus blessé
            let allieCible = alliesVivants[0];
            let minPourcentageHP = (allieCible.currentHp / allieCible.maxHp);
            
            for (const allie of alliesVivants) {
                const pourcentage = (allie.currentHp / allie.maxHp);
                if (pourcentage < minPourcentageHP) {
                    minPourcentageHP = pourcentage;
                    allieCible = allie;
                }
            }
            
            // Utiliser la méthode healAlly si elle existe
            let soinReel = 0;
            if ('healAlly' in joueur && typeof (joueur as any).healAlly === 'function') {
                soinReel = (joueur as any).healAlly(allieCible);
            } else {
                // Fallback: soigner 25% des HP max
                const soin = Math.floor(allieCible.maxHp * 0.25);
                const ancienHp = allieCible.currentHp;
                allieCible.currentHp = Math.min(allieCible.currentHp + soin, allieCible.maxHp);
                soinReel = allieCible.currentHp - ancienHp;
            }
            
            console.log(`\n💚 ${joueur.name} utilise GUÉRISON DIVINE sur ${allieCible.name} → +${soinReel} HP !`);
            return;
        }
        
        // Mage: utilise attackMagical (ignore défense)
        if (joueur.classe === "Mage" && 'attackMagical' in joueur) {
            const degats = (joueur as any).attackMagical(monstre);
            
            if (degats === 0) {
                console.log(`\n✨ ${joueur.name} n'a pas assez de mana ! Attaque de base à la place.`);
                await this.attaqueDeBase(joueur, monstre);
            } else {
                console.log(`\n🌟 ${joueur.name} utilise BOULE DE FEU sur ${monstre.name} → ${degats} dégâts (ignore défense) !`);
                
                if (!monstre.isAlive()) {
                    console.log(`💀 ${monstre.name} est vaincu !`);
                }
            }
            return;
        }
        
        // Barbarian: utilise berserkAttack
        if (joueur.classe === "Barbarian" && 'berserkAttack' in joueur) {
            const degats = (joueur as any).berserkAttack(monstre);
            console.log(`\n🔥 ${joueur.name} utilise BERSERK sur ${monstre.name} → ${degats} dégâts !`);
            
            if (!monstre.isAlive()) {
                console.log(`💀 ${monstre.name} est vaincu !`);
            }
            return;
        }
        
        // Paladin: utilise holyAttack (attaque de zone)
        if (joueur.classe === "Paladin" && 'holyAttack' in joueur) {
            const degats = (joueur as any).holyAttack([monstre]);
            console.log(`\n⚡ ${joueur.name} utilise FRAPPE SACRÉE sur ${monstre.name} → ${degats} dégâts !`);
            
            if (!monstre.isAlive()) {
                console.log(`💀 ${monstre.name} est vaincu !`);
            }
            return;
        }
        
        // Thief: attaque rapide + steal
        if (joueur.classe === "Thief") {
            const degats = Math.floor(Math.max(joueur.attack * 1.5 - monstre.defense, 0));
            monstre.currentHp = Math.max(monstre.currentHp - degats, 0);
            console.log(`\n🗡️ ${joueur.name} utilise ATTAQUE FURTIVE sur ${monstre.name} → ${degats} dégâts !`);
            
            // Tenter de voler
            if ('steal' in joueur && typeof (joueur as any).steal === 'function') {
                const objetVole = (joueur as any).steal();
                if (objetVole !== "Rien") {
                    console.log(`   💰 ${joueur.name} vole : ${objetVole} !`);
                    
                    // Convertir l'objet volé en objet utilisable
                    const conversionObjet: Record<string, ObjetType> = {
                        "Potion": "Potion",
                        "Fragment d'étoile": "Morceau d'étoile",
                        "Éther": "Ether",
                        "Demi-étoile": "Demi-étoile"
                    };
                    
                    const typeObjet = conversionObjet[objetVole];
                    if (typeObjet) {
                        this.ajouterObjet(typeObjet, 1);
                    }
                }
            }
            
            if (!monstre.isAlive()) {
                console.log(`💀 ${monstre.name} est vaincu !`);
            }
            return;
        }
        
        // Warrior: pas de compétence spéciale, juste attaque de base forte
        if (joueur.classe === "Warrior") {
            console.log(`\n⚔️ ${joueur.name} utilise ATTAQUE PUISSANTE !`);
            await this.attaqueDeBase(joueur, monstre);
            return;
        }
        
        // Par défaut: attaque puissante x1.5
        const degats = Math.floor(Math.max(joueur.attack * 1.5 - monstre.defense, 0));
        monstre.currentHp = Math.max(monstre.currentHp - degats, 0);
        console.log(`\n🌟 ${joueur.name} utilise sa COMPÉTENCE SPÉCIALE sur ${monstre.name} → ${degats} dégâts !`);
        
        if (!monstre.isAlive()) {
            console.log(`💀 ${monstre.name} est vaincu !`);
        }
    }

    /** Gère l'attaque d'un monstre */
    private async attaqueMonstre(monstre: Monster, equipe: Character[]): Promise<void> {
        const cible = monstre.random(equipe);
        
        if (!cible) {
            return; // Aucune cible disponible
        }

        const degats = Math.max(monstre.attack - cible.defense, 0);
        cible.currentHp = Math.max(cible.currentHp - degats, 0);
        
        console.log(`👹 ${monstre.name} attaque ${cible.name} → ${degats} dégâts`);

        if (!cible.isAlive()) {
            console.log(`\n💀 ${cible.name} est tombé au combat !\n`);
        }
    }

    /** Vérifie si au moins un membre de l'équipe est en vie */
    private equipeEnVie(): boolean {
        return this.equipe.some(joueur => joueur.isAlive());
    }

    /** Affiche l'état actuel du combat */
    private afficherEtatCombat(monstre: Monster): void {
        // Largeur fixe de la boîte
        const largeur = 50;
        const ligne = "─".repeat(largeur - 2);
        
        // Afficher le monstre
        console.log("\n┌" + ligne + "┐");
        const nomMonstre = `👹 ${monstre.name}`;
        const espacesNom = " ".repeat(Math.max(0, largeur - 2 - nomMonstre.length));
        console.log(`│${nomMonstre}${espacesNom}│`);
        
        const hpMonstre = `   HP: ${monstre.currentHp}/${monstre.maxHp}`;
        const espacesHP = " ".repeat(Math.max(0, largeur - 2 - hpMonstre.length));
        console.log(`│${hpMonstre}${espacesHP}│`);
        console.log("└" + ligne + "┘");
        
        // Afficher l'équipe
        console.log("\n┌" + ligne + "┐");
        const titreEquipe = "👥 VOTRE ÉQUIPE";
        const espacesTitre = " ".repeat(Math.max(0, largeur - 2 - titreEquipe.length));
        console.log(`│${titreEquipe}${espacesTitre}│`);
        console.log("├" + ligne + "┤");
        
        this.equipe.forEach((joueur, index) => {
            const statut = joueur.isAlive() ? "✓" : "✗";
            const cooldown = this.cooldowns.get(joueur) || 0;
            const cdText = cooldown > 0 ? `CD:${cooldown}` : "OK ";
            
            const ligne = `${statut} ${index + 1}. ${joueur.name.padEnd(12)} HP:${joueur.currentHp.toString().padStart(3)}/${joueur.maxHp.toString().padEnd(3)} [${cdText}]`;
            const espaces = " ".repeat(Math.max(0, largeur - 2 - ligne.length));
            console.log(`│${ligne}${espaces}│`);
        });
        
        console.log("└" + ligne + "┘");
    }

    /** Menu de repos entre les salles */
    private async menuRepos(): Promise<void> {
        console.clear();
        console.log("\n╔════════════════════════════════╗");
        console.log("║      REPOS ENTRE LES SALLES    ║");
        console.log("╚════════════════════════════════╝\n");
        
        let continuer = true;
        while (continuer) {
            console.log("\nQue voulez-vous faire ?");
            console.log("1. Utiliser un objet de l'inventaire");
            console.log("2. Voir l'état de l'équipe");
            console.log("3. Continuer vers la prochaine salle");
            
            const choix = prompt("\nVotre choix : ");
            
            switch (choix) {
                case "1":
                    await this.utiliserObjetInventaire();
                    break;
                case "2":
                    this.afficherEquipeRepos();
                    prompt("\n[Appuyez sur Entrée pour continuer]");
                    console.clear();
                    break;
                case "3":
                    continuer = false;
                    break;
                default:
                    console.log("\n❌ Choix invalide.");
            }
        }
    }

    /** Utiliser un objet pendant le combat */
    private async utiliserObjetCombat(): Promise<void> {
        if (this.inventaire.length === 0) {
            console.log("\n❌ Votre inventaire est vide. Tour passé !");
            await this.pause(1500);
            return;
        }
        
        console.log("\n=== INVENTAIRE ===\n");
        
        this.inventaire.forEach((objet, index) => {
            console.log(`${index + 1}. ${objet.icone} ${objet.nom} x${objet.quantite}`);
        });
        console.log(`${this.inventaire.length + 1}. Annuler (attaque physique à la place)`);
        
        const choixObjet = prompt("\nChoisir un objet : ");
        const indexObjet = parseInt(choixObjet || "0") - 1;
        
        if (indexObjet < 0 || indexObjet >= this.inventaire.length) {
            console.log("\n❌ Annulé. Tour perdu.");
            await this.pause(1000);
            return;
        }
        
        const objet = this.inventaire[indexObjet];
        
        // Sélection automatique de la cible : celui avec les PV les plus bas
        let cible: Character;
        
        // Si c'est une résurrection, cibler un personnage K.O.
        if (objet.nom === "Morceau d'étoile" || objet.nom === "Demi-étoile") {
            const morts = this.equipe.filter(p => !p.isAlive());
            if (morts.length > 0) {
                cible = morts[0];
                console.log(`\n→ Cible automatique (K.O.) : ${cible.name}`);
            } else {
                // Sinon, cibler celui avec le moins de HP
                cible = this.equipe.reduce((min, p) => 
                    p.isAlive() && p.currentHp < min.currentHp ? p : min
                , this.equipe.filter(p => p.isAlive())[0]);
                console.log(`\n→ Cible automatique (+ blessé) : ${cible.name}`);
            }
        } else {
            // Pour les potions et ethers, cibler celui avec les PV/MP les plus bas
            const vivants = this.equipe.filter(p => p.isAlive());
            if (vivants.length === 0) {
                console.log("\n❌ Aucune cible valide !");
                await this.pause(1500);
                return;
            }
            
            if (objet.nom === "Ether") {
                // Cibler celui avec le moins de MP
                cible = vivants.reduce((min, p) => p.currentMp < min.currentMp ? p : min, vivants[0]);
                console.log(`\n→ Cible automatique (moins de MP) : ${cible.name}`);
            } else {
                // Cibler celui avec le moins de HP
                cible = vivants.reduce((min, p) => p.currentHp < min.currentHp ? p : min, vivants[0]);
                console.log(`\n→ Cible automatique (moins de HP) : ${cible.name}`);
            }
        }
        
        // Appliquer l'effet de l'objet
        const resultat = this.utiliserObjet(objet.nom, cible);
        console.log(`\n${resultat}`);
        
        // Réduire la quantité
        objet.quantite--;
        if (objet.quantite <= 0) {
            this.inventaire = this.inventaire.filter(obj => obj !== objet);
        }
        
        await this.pause(2000);
    }

    /** Utiliser un objet de l'inventaire pendant le repos */
    private async utiliserObjetInventaire(): Promise<void> {
        if (this.inventaire.length === 0) {
            console.log("\n❌ Votre inventaire est vide.");
            await this.pause(1500);
            return;
        }
        
        console.clear();
        console.log("\n=== INVENTAIRE ===\n");
        
        this.inventaire.forEach((objet, index) => {
            console.log(`${index + 1}. ${objet.icone} ${objet.nom} x${objet.quantite}`);
        });
        console.log(`${this.inventaire.length + 1}. Annuler`);
        
        const choixObjet = prompt("\nChoisir un objet : ");
        const indexObjet = parseInt(choixObjet || "0") - 1;
        
        if (indexObjet < 0 || indexObjet >= this.inventaire.length) {
            return; // Annulé
        }
        
        const objet = this.inventaire[indexObjet];
        
        // Choisir la cible
        console.log("\n=== Choisir la cible ===\n");
        this.equipe.forEach((perso, index) => {
            const statut = perso.isAlive() ? "✓" : "✗ K.O.";
            console.log(`${index + 1}. ${perso.name} - ${statut} - HP: ${perso.currentHp}/${perso.maxHp}`);
        });
        
        const choixCible = prompt("\nChoisir un personnage : ");
        const indexCible = parseInt(choixCible || "0") - 1;
        
        if (indexCible < 0 || indexCible >= this.equipe.length) {
            return; // Annulé
        }
        
        const cible = this.equipe[indexCible];
        
        // Appliquer l'effet de l'objet
        const resultat = this.utiliserObjet(objet.nom, cible);
        console.log(`\n${resultat}`);
        
        // Réduire la quantité
        objet.quantite--;
        if (objet.quantite <= 0) {
            this.inventaire.splice(indexObjet, 1);
        }
        
        await this.pause(2000);
    }

    /** Utilise un objet sur une cible */
    private utiliserObjet(type: ObjetType, cible: Character): string {
        switch (type) {
            case "Potion":
                if (!cible.isAlive()) {
                    return "❌ Impossible d'utiliser une Potion sur un personnage K.O. !";
                }
                const soinPotion = Math.floor(cible.maxHp * 0.5);
                const ancienHpPotion = cible.currentHp;
                cible.currentHp = Math.min(cible.currentHp + soinPotion, cible.maxHp);
                const soinReelPotion = cible.currentHp - ancienHpPotion;
                return `✓ 🧪 Potion utilisée ! ${cible.name} récupère ${soinReelPotion} HP !`;
                
            case "Morceau d'étoile":
                if (!cible.isAlive()) {
                    // Ressuscite avec 20% HP
                    cible.currentHp = Math.floor(cible.maxHp * 0.2);
                    return `✓ ✨ ${cible.name} est ressuscité avec ${cible.currentHp} HP !`;
                } else {
                    // Soigne 50% HP
                    const soinFragment = Math.floor(cible.maxHp * 0.5);
                    const ancienHpFragment = cible.currentHp;
                    cible.currentHp = Math.min(cible.currentHp + soinFragment, cible.maxHp);
                    const soinReelFragment = cible.currentHp - ancienHpFragment;
                    return `✓ ✨ Morceau d'étoile utilisé ! ${cible.name} récupère ${soinReelFragment} HP !`;
                }
                
            case "Demi-étoile":
                if (!cible.isAlive()) {
                    // Ressuscite avec tous les HP
                    cible.currentHp = cible.maxHp;
                    return `✓ 🌟 ${cible.name} est complètement ressuscité avec ${cible.maxHp} HP !`;
                } else {
                    // Soigne entièrement
                    const soinDemi = cible.maxHp - cible.currentHp;
                    cible.currentHp = cible.maxHp;
                    return `✓ 🌟 Demi-étoile utilisée ! ${cible.name} est complètement soigné (+${soinDemi} HP) !`;
                }
                
            case "Ether":
                if (!cible.isAlive()) {
                    return "❌ Impossible d'utiliser un Ether sur un personnage K.O. !";
                }
                const regenMp = Math.floor(cible.maxMp * 0.3);
                const ancienMp = cible.currentMp;
                cible.currentMp = Math.min(cible.currentMp + regenMp, cible.maxMp);
                const regenReelMp = cible.currentMp - ancienMp;
                return `✓ 💊 Ether utilisé ! ${cible.name} récupère ${regenReelMp} MP !`;
                
            default:
                return "❌ Objet inconnu !";
        }
    }

    /** Affiche l'équipe pendant le repos */
    private afficherEquipeRepos(): void {
        console.clear();
        const largeur = 50;
        const ligne = "─".repeat(largeur - 2);
        
        console.log("\n┌" + ligne + "┐");
        const titre = "ÉTAT DE L'ÉQUIPE";
        const espacesTitre = " ".repeat(Math.max(0, largeur - 2 - titre.length));
        console.log(`│${titre}${espacesTitre}│`);
        console.log("├" + ligne + "┤");
        
        this.equipe.forEach((joueur, index) => {
            const cooldown = this.cooldowns.get(joueur) || 0;
            
            // Ligne 1: Nom et classe
            const ligne1 = `${index + 1}. ${joueur.name} (${joueur.classe})`;
            const espaces1 = " ".repeat(Math.max(0, largeur - 2 - ligne1.length));
            console.log(`│${ligne1}${espaces1}│`);
            
            // Ligne 2: HP
            const ligne2 = `   HP: ${joueur.currentHp}/${joueur.maxHp}`;
            const espaces2 = " ".repeat(Math.max(0, largeur - 2 - ligne2.length));
            console.log(`│${ligne2}${espaces2}│`);
            
            // Ligne 3: MP
            const ligne3 = `   MP: ${joueur.currentMp}/${joueur.maxMp}`;
            const espaces3 = " ".repeat(Math.max(0, largeur - 2 - ligne3.length));
            console.log(`│${ligne3}${espaces3}│`);
            
            // Ligne 4: Compétence
            const cdStatus = cooldown > 0 ? `Cooldown ${cooldown} tours` : "Prête";
            const ligne4 = `   Compétence: ${cdStatus}`;
            const espaces4 = " ".repeat(Math.max(0, largeur - 2 - ligne4.length));
            console.log(`│${ligne4}${espaces4}│`);
            
            // Séparateur entre personnages (sauf le dernier)
            if (index < this.equipe.length - 1) {
                console.log("├" + ligne + "┤");
            }
        });
        
        console.log("└" + ligne + "┘");
    }

    /** Génère un monstre spécifique basé sur la salle */
    private genererMonstre(): Monster {
        // Seulement 3 boss pour les salles 1, 3 et 5
        switch (this.salleActuelle) {
            case 1:
                return new Fenrir(); // Boss 1: Loup rapide et agressif
            case 3:
                return new Meduse(); // Boss 2: Reine Gorgone magique
            case 5:
                return new Anubis(); // Boss 3 Final: Gardien des Ombres
            default:
                return new Fenrir();
        }
    }

    /** Gère une salle au trésor */
    private async salleAuTresor(): Promise<void> {
        console.log("✨ Vous découvrez une salle au trésor !\n");
        
        // Régénération automatique dans les salles au trésor
        this.regenererEquipe();
        console.log("💚 Votre équipe récupère 30% de vie...\n");
        
        prompt("[Appuyez sur Entrée pour ouvrir le coffre]");

        console.log("\n🎁 Vous trouvez un coffre...\n");
        
        // Un seul coffre
        const nombreCoffres = 1;
        
        for (let i = 1; i <= nombreCoffres; i++) {
            console.log(`\n📦 Coffre ${i}/${nombreCoffres}`);
            console.log("\nQui ouvre le coffre ?\n");
            
            // Afficher la liste des personnages avec leurs HP
            this.equipe.forEach((perso, index) => {
                const statut = perso.isAlive() ? "✓" : "✗ K.O.";
                console.log(`${index + 1}. ${perso.name} - ${statut} - HP: ${perso.currentHp}/${perso.maxHp}`);
            });
            
            // Demander au joueur de choisir
            const choix = prompt("\nVotre choix (1-3) : ");
            const indexOuvreur = parseInt(choix || "1") - 1;
            
            // Valider le choix
            let ouvreur: Character;
            if (indexOuvreur >= 0 && indexOuvreur < this.equipe.length) {
                ouvreur = this.equipe[indexOuvreur];
            } else {
                console.log("❌ Choix invalide. Le premier personnage ouvre le coffre.");
                ouvreur = this.equipe[0];
            }
            
            console.log(`\n${ouvreur.name} s'approche du coffre...`);
            await this.pause(800);
            
            // 10% de chance que ce soit un piège
            if (Math.random() < 0.1) {
                // PIÈGE !
                const degats = Math.floor(Math.random() * 20) + 10; // 10-30 dégâts
                ouvreur.currentHp = Math.max(ouvreur.currentHp - degats, 0);
                
                console.log(`   💥 PIÈGE ! ${ouvreur.name} subit ${degats} dégâts !`);
                console.log(`   HP de ${ouvreur.name}: ${ouvreur.currentHp}/${ouvreur.maxHp}`);
                
                if (!ouvreur.isAlive()) {
                    console.log(`   ☠️  ${ouvreur.name} est K.O. !`);
                }
            } else {
                // TRÉSOR - Uniquement des objets consommables
                const objetsDisponibles: ObjetType[] = ["Potion", "Morceau d'étoile", "Demi-étoile", "Ether"];
                const randomIndex = Math.floor(Math.random() * objetsDisponibles.length);
                let typeObjet = objetsDisponibles[randomIndex];
                
                // Demi-étoile est très rare (5% de chance)
                if (typeObjet === "Demi-étoile" && Math.random() > 0.05) {
                    typeObjet = "Morceau d'étoile"; // Remplacer par fragment
                }
                
                // Quantité : Potion/Ether (1-3), Étoiles (1)
                const quantite = (typeObjet === "Potion" || typeObjet === "Ether") ? 
                    Math.floor(Math.random() * 3) + 1 : 1;
                
                this.ajouterObjet(typeObjet, quantite);
                
                const icones: Record<ObjetType, string> = {
                    "Potion": "🧪",
                    "Morceau d'étoile": "✨",
                    "Demi-étoile": "🌟",
                    "Ether": "💊"
                };
                
                console.log(`   ✓ ${icones[typeObjet]} ${typeObjet} x${quantite}`);
            }
            
            await this.pause(800);
        }

        console.log("\n✓ Exploration de la salle terminée !");
        prompt("\n[Appuyez sur Entrée pour continuer]");
    }

    /** Applique un bonus d'équipement à l'équipe */
    private appliquerBonus(nomTresor: string): Character | null {
        const membresVivants = this.equipe.filter(p => p.isAlive());
        if (membresVivants.length === 0) return null;

        const membre = membresVivants[Math.floor(Math.random() * membresVivants.length)];

        if (nomTresor.includes("Épée")) {
            membre.attack += 5;
        } else if (nomTresor.includes("Armure")) {
            membre.defense += 5;
        } else if (nomTresor.includes("Amulette")) {
            membre.attack += 5;
        } else if (nomTresor.includes("Bouclier")) {
            membre.defense += 5;
        } else if (nomTresor.includes("Bottes")) {
            membre.speed += 3;
        } else if (nomTresor.includes("Potion")) {
            const heal = Math.floor(membre.maxHp * 0.5);
            membre.currentHp = Math.min(membre.currentHp + heal, membre.maxHp);
        } else if (nomTresor.includes("Élixir")) {
            membre.currentMp = membre.maxMp;
        } else if (nomTresor.includes("Pierre")) {
            membre.maxHp += 20;
            membre.currentHp += 20;
        }
        
        return membre;
    }

    /** Récupère les trésors collectés */
    public getTresors(): string[] {
        return this.tresors;
    }

    /** Régénère partiellement l'équipe entre les salles */
    private regenererEquipe(): void {
        this.equipe.forEach(joueur => {
            if (joueur.isAlive()) {
                // Régénère 30% de la vie max
                const regen = Math.floor(joueur.maxHp * 0.3);
                joueur.currentHp = Math.min(joueur.currentHp + regen, joueur.maxHp);
            }
        });
    }

    /** Affiche le message de victoire d'une salle */
    private afficherVictoireSalle(): void {
        console.log("\n╔════════════════════════════════╗");
        console.log("║        🎉 VICTOIRE !           ║");
        console.log("╚════════════════════════════════╝");
        console.log(`\n✓ Salle ${this.salleActuelle}/${this.NOMBRE_SALLES} terminée !`);
    }

    /** Affiche le message de victoire finale */
    private afficherVictoireFinale(): void {
        console.clear();
        console.log("\n╔════════════════════════════════╗");
        console.log("║    🏆 VICTOIRE FINALE ! 🏆    ║");
        console.log("╚════════════════════════════════╝\n");
        console.log("Félicitations ! Vous avez traversé tout le donjon !");
        console.log(`Votre équipe a survécu aux ${this.NOMBRE_SALLES} salles !\n`);
    }

    /** Affiche le message de défaite */
    private afficherDefaite(): void {
        console.log("\n╔════════════════════════════════╗");
        console.log("║        💀 DÉFAITE...           ║");
        console.log("╚════════════════════════════════╝\n");
        console.log("Votre équipe a été vaincue...");
        console.log(`Vous avez atteint la salle ${this.salleActuelle}/${this.NOMBRE_SALLES}\n`);
    }

    /** Pause pour l'affichage */
    private async pause(ms: number): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, ms));
    }

    /** Récupère le numéro de la salle actuelle */
    public getSalleActuelle(): number {
        return this.salleActuelle;
    }

    /** Récupère le nombre total de salles */
    public getNombreSalles(): number {
        return this.NOMBRE_SALLES;
    }
}
