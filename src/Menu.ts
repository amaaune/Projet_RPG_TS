import { Character } from "./Characters.ts";
import { Barbarian } from "../characters/Barbarian.ts";
import { Mage } from "../characters/Mage.ts";
import { Paladin } from "../characters/Paladin.ts";
import { Priest } from "../characters/Priest.ts";
import { Thief } from "../characters/Thief.ts";
import { Warrior } from "../characters/Warrior.ts";
import { GameManager } from "./GameManager.ts";

// Interface pour définir une option de menu
interface OptionMenu {
    numero: number;
    texte: string;
    action: () => Promise<void>;
}

export class Menu {
    private equipe: Character[] = [];
    private inventaire: string[] = [];

    /** 
     * Méthode générique pour afficher un menu avec des options personnalisées
     * @param titre - Le titre du menu à afficher
     * @param options - Un tableau d'options avec numéro, texte et action
     * @param boucle - Si true, le menu se répète jusqu'à ce qu'on quitte (défaut: false)
     */
    public async afficherMenuGenerique(
        titre: string, 
        options: OptionMenu[], 
        boucle: boolean = false
    ): Promise<void> {
        let continuer = true;
        
        while (continuer) {
            console.clear();
            console.log("╔════════════════════════════════╗");
            console.log(`║    ${titre.padEnd(28)}║`);
            console.log("╚════════════════════════════════╝");
            console.log("");
            
            // Afficher toutes les options
            options.forEach(option => {
                console.log(`${option.numero}. ${option.texte}`);
            });
            console.log("");
            
            const reponse = prompt("Entrez votre choix : ");
            
            if (reponse === null) {
                console.log("\n✗ Aucune réponse. Au revoir !");
                break;
            }
            
            const choix = parseInt(reponse);
            
            // Trouver l'option correspondante
            const optionChoisie = options.find(opt => opt.numero === choix);
            
            if (optionChoisie) {
                console.log(`\n✓ ${optionChoisie.texte}`);
                await optionChoisie.action();
                
                // Si ce n'est pas une boucle, on sort après l'action
                if (!boucle) {
                    continuer = false;
                }
                
                // Si l'option est "Quitter" (généralement option 0), on sort
                if (choix === 0) {
                    continuer = false;
                }
            } else {
                const numeros = options.map(opt => opt.numero).join(", ");
                console.log(`\n✗ Choix invalide. Veuillez choisir parmi : ${numeros}`);
                await new Promise(resolve => setTimeout(resolve, 1500));
            }
        }
    }

    public async afficherMenu(): Promise<void> {
        const options: OptionMenu[] = [
            {
                numero: 1,
                texte: "Créer une équipe",
                action: async () => await this.traiterOption1()
            },
            {
                numero: 0,
                texte: "Quitter",
                action: async () => await this.traiterOption2()
            }
        ];
        
        await this.afficherMenuGenerique("MENU PRINCIPAL", options);
    }

    private async demanderChoix(): Promise<void> {
        // Récupération de la réponse de l'utilisateur depuis le terminal
        const reponse = prompt("Entrez votre choix : ");
        
        if (reponse === null) {
            console.log("\n✗ Aucune réponse. Au revoir !");
            return;
        }

        // Conversion de la réponse (string) en nombre
        // choix est maintenant de type number et peut être comparé aux différents case
        const choix = parseInt(reponse);
        
        // Le switch compare la valeur numérique de choix avec chaque case
        // Une fois un case sélectionné, il lance la méthode async correspondante
        switch (choix) {
            case 1:
                console.log("\n✓ Vous avez choisi l'option 1 - Commencer");
                await this.traiterOption1(); // Appel de la méthode async pour l'option 1
                break;
            case 2:
                console.log("\n✓ Vous avez choisi l'option 2 - Commencer");
                await this.traiterOption1(); // Appel de la méthode async pour l'option 1
                break;
            case 0:
                console.log("\n✓ Vous avez choisi l'option 0 - Quitter");
                await this.traiterOption2(); // Appel de la méthode async pour l'option 2
                break;
            default:
                console.log("\n✗ Choix invalide. Veuillez choisir 1, 2 ou 0.");
                await this.demanderChoix();
                break;
        }
    }

    private async traiterOption1(): Promise<void> {
        console.log("Traitement de l'option 1...");
        await this.creerEquipe();
        
        // Afficher l'équipe créée
        console.log("\n=== Votre équipe ===");
        this.equipe.forEach((personnage, index) => {
            console.log(`${index + 1}. ${personnage.name} - ${personnage.classe} - HP: ${personnage.maxHp}`);
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Afficher le menu secondaire
        await this.afficherMenuJeu();
    }

    /** Permet à l'utilisateur de créer une équipe de 3 personnages */
    private async creerEquipe(): Promise<void> {
        this.equipe = [];
        
        for (let i = 1; i <= 3; i++) {
            console.clear();
            console.log(`\n=== Sélection du personnage ${i}/3 ===\n`);
            console.log("1. Barbarian - Tank brutal");
            console.log("2. Mage - Damage dealer magique");
            console.log("3. Paladin - Tank/Support");
            console.log("4. Priest - Soigneur");
            console.log("5. Thief - DPS rapide");
            console.log("6. Warrior - Tank offensif");
            console.log("");
            
            const choixClasse = await this.demanderChoixClasse();
            const nomPersonnage = await this.demanderNomPersonnage(i);
            
            // Créer le personnage selon le choix
            let personnage: Character;
            switch (choixClasse) {
                case 1:
                    personnage = new Barbarian(nomPersonnage);
                    break;
                case 2:
                    personnage = new Mage(nomPersonnage);
                    break;
                case 3:
                    personnage = new Paladin(nomPersonnage);
                    break;
                case 4:
                    personnage = new Priest(nomPersonnage);
                    break;
                case 5:
                    personnage = new Thief(nomPersonnage);
                    break;
                case 6:
                    personnage = new Warrior(nomPersonnage);
                    break;
                default:
                    personnage = new Warrior(nomPersonnage); // Par défaut
            }
            
            this.equipe.push(personnage);
            console.log(`\n✓ ${personnage.name} a été ajouté à l'équipe !`);
            
            // Petit délai avant le prochain choix
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        console.log("\n✓ Équipe complète !");
    }

    /** Demande le choix de la classe */
    private async demanderChoixClasse(): Promise<number> {
        const reponse = prompt("Choisissez une classe (1-6) : ");
        
        if (reponse === null) {
            return 6; // Par défaut Warrior
        }
        
        const choix = parseInt(reponse);
        
        if (choix >= 1 && choix <= 6) {
            return choix;
        } else {
            console.log("✗ Choix invalide. Veuillez choisir entre 1 et 6.");
            return await this.demanderChoixClasse();
        }
    }

    /** Demande le nom du personnage */
    private async demanderNomPersonnage(numero: number): Promise<string> {
        const reponse = prompt(`Donnez un nom au personnage ${numero} : `);
        
        if (reponse === null || reponse.trim() === "") {
            return `Personnage${numero}`; // Nom par défaut
        }
        
        return reponse.trim();
    }

    /** Récupère l'équipe créée */
    public getEquipe(): Character[] {
        return this.equipe;
    }

    /** Menu secondaire après la création de l'équipe */
    private async afficherMenuJeu(): Promise<void> {
        const options: OptionMenu[] = [
            {
                numero: 1,
                texte: "Afficher l'équipe",
                action: async () => await this.afficherEquipe()
            },
            {
                numero: 2,
                texte: "Partir en exploration",
                action: async () => await this.partirEnExploration()
            },
            {
                numero: 3,
                texte: "Consulter l'inventaire",
                action: async () => await this.consulterInventaire()
            },
            {
                numero: 0,
                texte: "Quitter le jeu",
                action: async () => {
                    console.log("\n✓ Au revoir ! Merci d'avoir joué.");
                }
            }
        ];
        
        await this.afficherMenuGenerique("MENU DU JEU", options, true);
    }

    /** Affiche l'équipe avec les détails */
    private async afficherEquipe(): Promise<void> {
        console.clear();
        console.log("\n╔════════════════════════════════╗");
        console.log("║       VOTRE ÉQUIPE             ║");
        console.log("╚════════════════════════════════╝\n");
        
        if (this.equipe.length === 0) {
            console.log("Aucun personnage dans l'équipe.");
        } else {
            this.equipe.forEach((personnage, index) => {
                console.log(`${index + 1}. ${personnage.name}`);
                console.log(`   Classe: ${personnage.classe || 'N/A'}`);
                console.log(`   HP: ${personnage.currentHp}/${personnage.maxHp}`);
                console.log(`   MP: ${personnage.currentMp}/${personnage.maxMp}`);
                console.log(`   Attaque: ${personnage.attack}`);
                console.log(`   Défense: ${personnage.defense}`);
                console.log(`   Vitesse: ${personnage.speed}`);
                console.log("");
            });
        }
        
        prompt("\nAppuyez sur Entrée pour continuer...");
    }

    /** Partir en exploration */
    private async partirEnExploration(): Promise<void> {
        // Vérifier que l'équipe existe et a des membres vivants
        if (this.equipe.length === 0) {
            console.clear();
            console.log("\n✗ Vous devez d'abord créer une équipe !");
            prompt("\nAppuyez sur Entrée pour continuer...");
            return;
        }

        const membresVivants = this.equipe.filter(p => p.isAlive());
        if (membresVivants.length === 0) {
            console.clear();
            console.log("\n✗ Votre équipe est morte ! Vous ne pouvez plus explorer.");
            prompt("\nAppuyez sur Entrée pour continuer...");
            return;
        }

        console.clear();
        console.log("\n╔════════════════════════════════╗");
        console.log("║       EXPLORATION              ║");
        console.log("╚════════════════════════════════╝\n");
        
        console.log("🗺️  Vous partez explorer le donjon...");
        console.log("⚠️  Préparez-vous à affronter 5 salles dans ce Donjon d'un autre temps !\n");
        
        const confirmation = prompt("Êtes-vous prêt ? (o/n) : ");
        
        if (confirmation?.toLowerCase() !== 'o') {
            console.log("\n✓ Vous restez au camp pour vous préparer.");
            await new Promise(resolve => setTimeout(resolve, 1500));
            return;
        }

        // Lancer le GameManager avec l'équipe
        const gameManager = new GameManager(this.equipe);
        const victoire = await gameManager.lancerExploration();

        // Ajouter une récompense si victoire
        if (victoire) {
            const recompenses = [
                "Épée légendaire",
                "Armure divine",
                "Potion ultime",
                "Anneau de pouvoir",
                "Trésor ancien"
            ];
            const recompense = recompenses[Math.floor(Math.random() * recompenses.length)];
            this.inventaire.push(recompense);
            console.log(`\n🎁 Vous avez obtenu : ${recompense}`);
        }
        
        prompt("\nAppuyez sur Entrée pour continuer...");
    }

    /** Consulter l'inventaire */
    private async consulterInventaire(): Promise<void> {
        console.clear();
        console.log("\n╔════════════════════════════════╗");
        console.log("║       INVENTAIRE               ║");
        console.log("╚════════════════════════════════╝\n");
        
        if (this.inventaire.length === 0) {
            console.log("Votre inventaire est vide.");
        } else {
            console.log(`Vous avez ${this.inventaire.length} objet(s) :\n`);
            this.inventaire.forEach((objet, index) => {
                console.log(`${index + 1}. ${objet}`);
            });
        }
        
        prompt("\nAppuyez sur Entrée pour continuer...");
    }

    private async traiterOption2(): Promise<void> {
        console.log("Au revoir !");
    }
}

// Exemple d'utilisation
if (import.meta.main) {
    const menu = new Menu();
    await menu.afficherMenu();
}
