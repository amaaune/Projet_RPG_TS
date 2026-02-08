import { Menu } from "./src/Menu.ts";
import terminalImage from "npm:terminal-image@2.0.0";

class Game {
    /** Affiche l'image et le titre du jeu */
    private async afficherTitreAvecImage(): Promise<void> {
        console.clear();
        
        try {
            const image = await terminalImage.file("./img/DEICIDE_image.png", {
                width: 50,
                preserveAspectRatio: true
            });
            
            const lignesImage = image.split('\n');
            const imageCentree = lignesImage.map(ligne => '              ' + ligne).join('\n');
            
            console.log("\n");
            console.log(imageCentree);
            console.log("\n");
        } catch (error) {
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

    /** Lance le jeu */
    public async start(): Promise<void> {
        await this.afficherTitreAvecImage();
        prompt("              Appuyez sur Entrée pour commencer...");
        
        const menu = new Menu();
        await menu.afficherMenu();
        
        console.log("\n👋 Merci d'avoir joué à DÉICIDE !");
    }
}

new Game().start();
