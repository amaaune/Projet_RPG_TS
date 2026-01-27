// main.ts

// Import de la librairie d'affichage depuis NPM
import terminalImage from "npm:terminal-image";

// Import des utilitaires de chemin de la bibliothèque standard Deno
// Ils servent à calculer où se trouve le fichier par rapport à ce script.
import { join, dirname, fromFileUrl } from "https://deno.land/std@0.224.0/path/mod.ts";

// --- Configuration ---
const dossierImages = "img";
const nomFichierImage = "DEICIDE_image.png";

// --- Calcul du chemin absolu ---
// 1. Obtient l'URL du fichier actuel (main.ts)
const scriptUrl = import.meta.url;
// 2. Convertit l'URL en chemin de fichier système (ex: /Users/moi/projet/main.ts)
const scriptFilePath = fromFileUrl(scriptUrl);
// 3. Obtient le dossier dossier parent (ex: /Users/moi/projet)
const projetRoot = dirname(scriptFilePath);
// 4. Construit le chemin final vers l'image (ex: /Users/moi/projet/img/DEICIDE_image.png)
const cheminImageAbsolu = join(projetRoot, dossierImages, nomFichierImage);


console.log("Tentative de chargement de l'image...");
// console.log(`Chemin ciblé : ${cheminImageAbsolu}`); // Décommente pour déboguer

try {
  // Lecture du fichier en utilisant le chemin absolu calculé
  const imageRaw = await Deno.readFile(cheminImageAbsolu);

  // Génération du rendu (j'ai ajouté width: '100%' pour qu'elle prenne la largeur du terminal)
  const rendu = await terminalImage.buffer(imageRaw, { width: '100%' });

  // Affichage
  console.log('\n' + rendu + '\n');
  console.log("Jeu prêt à démarrer...");

} catch (err) {
    if (err instanceof Deno.errors.NotFound) {
        console.error(`\n[ERREUR FATALE] Image introuvable !`);
        console.error(`Le script a cherché ici : ${cheminImageAbsolu}`);
        console.error(`Vérifie que le dossier 'img' existe et contient bien 'DEICIDE_image.png'.`);
    } else if (err instanceof Deno.errors.PermissionDenied) {
        console.error(`\n[ERREUR DE PERMISSION] Deno n'a pas le droit de lire le fichier.`);
        console.error(`Ajoute le flag '--allow-read' à ta commande.`);
    } else {
        // Autres erreurs inattendues
        throw err;
    }
    Deno.exit(1); // Quitte le programme avec une erreur
}

// Le reste de ton code de jeu viendrait ici...


console.log("Bienvenu dans Déicide !")