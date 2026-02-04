// main.ts

// Import du Menu du jeu
import { Menu } from "./src/Menu.ts";
import terminalImage from "npm:terminal-image@2.0.0";

// Affichage de l'image et du titre
async function afficherTitreAvecImage() {
    console.clear();
    
    try {
        // Afficher l'image (largeur de 50 colonnes pour qu'elle soit visible mais pas trop grande)
        const image = await terminalImage.file("./img/DEICIDE_image.png", {
            width: 50,
            preserveAspectRatio: true
        });
        
        // Centrer l'image en ajoutant des espaces avant chaque ligne
        const lignesImage = image.split('\n');
        const imageCentree = lignesImage.map(ligne => '              ' + ligne).join('\n');
        
        console.log("\n");
        console.log(imageCentree);
        console.log("\n");
    } catch (error) {
        // Si l'image ne peut pas être chargée, afficher l'ASCII art
        console.log("\n\n");
        console.log("  ╔═══════════════════════════════════════════════════════════════╗");
        console.log("  ║                                                               ║");
        console.log("  ║        ██████╗ ███████╗██╗ ██████╗██╗██████╗ ███████╗         ║");
        console.log("  ║        ██╔══██╗██╔════╝██║██╔════╝██║██╔══██╗██╔════╝         ║");
        console.log("  ║        ██║  ██║█████╗  ██║██║     ██║██║  ██║█████╗           ║");
        console.log("  ║        ██║  ██║██╔══╝  ██║██║     ██║██║  ██║██╔══╝           ║");
        console.log("  ║        ██████╔╝███████╗██║╚██████╗██║██████╔╝███████╗         ║");
        console.log("  ║        ╚═════╝ ╚══════╝╚═╝ ╚═════╝╚═╝╚═════╝ ╚══════╝         ║");
        console.log("  ║                                                               ║");
        console.log("  ║                     ~ Tueur de Dieux ~                        ║");
        console.log("  ║                                                               ║");
        console.log("  ╚═══════════════════════════════════════════════════════════════╝");
        console.log("\n");
    }
    
    console.log("              Préparez-vous à affronter les légendes...");
    console.log("\n");
}

// Fonction principale
async function main() {
    // Afficher le titre avec l'image
    await afficherTitreAvecImage();
    
    // Attendre que le joueur appuie sur Entrée
    prompt("              Appuyez sur Entrée pour commencer...");
    
    // Lancement du jeu via le Menu
    const menu = new Menu();
    await menu.afficherMenu();
    
    console.log("\n👋 Merci d'avoir joué à DÉICIDE !");
}

// Lancer le jeu
main();
