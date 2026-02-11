# DEICIDE - Tueur de Dieux

## Description du Jeu

DEICIDE est un jeu de rôle tactique en ligne de commande où vous incarnez un héros appelé à affronter les légendes des mythologies anciennes. Vous pénétrez dans un donjon mystique rempli de créatures provenant de trois panthéons : les dieux nordiques, les créatures grecques et les divinités égyptiennes.

Le jeu utilise un système de combat au tour par tour où stratégie et composition d'équipe sont essentiels pour progresser. Chaque personnage possède des rôles distincts : attaquants physiques, lanceurs de sorts, soigneurs et utilitaires. Vous devrez affronter progressivement des ennemis plus puissants jusqu'aux trois boss finaux qui incarnent la puissance brute de chaque mythologie.

## Arborescence du Projet

```
Projet_RPG_TS/
├── main.ts                  # Point d'entrée du jeu
├── deno.json                # Configuration Deno
├── README.md                # Ce fichier
├── img/                     # Images du jeu
├── characters/              # Classes de personnages jouables
│   ├── Barbarian.ts         # Barbare - dégâts massifs
│   ├── Warrior.ts           # Guerrier - équilibré offensif
│   ├── Paladin.ts           # Paladin - tank/support
│   ├── Mage.ts              # Magicien - dégâts magiques
│   ├── Priest.ts            # Prêtre - guérison
│   └── Thief.ts             # Voleur - rapidité et utilité
├── monsters/                # Classes de monstres et boss
│   ├── Monsters.ts          # Classe de base des monstres
│   ├── Fenrir.ts            # Boss Nordique
│   ├── Meduse.ts            # Boss Grec
│   ├── Anubis.ts            # Boss Égyptien
│   └── [autres_monstres]    # Ennemis normaux
└── src/                     # Système de jeu
    ├── Application.ts       # Classe principale
    ├── Characters.ts        # Classe de base Character
    ├── Menu.ts              # Interface menu
    ├── Fight.ts             # Système de combat
    ├── GameManager.ts       # Gestion de la progression
    └── interfaces/
        └── IInterfaces.ts   # Interfaces du projet
```

## Comment Jouer

### Sélection du Personnage

Au démarrage, le jeu vous propose de choisir entre 6 personnages. Chacun possède une classe, des statistiques uniques et des capacités spéciales. Sélectionnez celui qui convient à votre style de jeu.

### Système de Combat

Le combat fonctionne au tour par tour. À chaque tour, vous pouvez :
- Attaquer l'ennemi
- Utiliser une capacité spéciale (si disponible)
- Utiliser un objet (potions, etc.)
- Vous défendre

La vitesse détermine qui agit en premier. L'Attaque et la Défense sont les stats principales du combat. Les Points de Vie (HP) représentent votre santé. Lorsque vos HP atteignent 0, vous êtes éliminé.

### Progression

Vous affronterez des ennemis de plus en plus difficiles. Progressivement, vous découvrirez et combattrez les trois boss majeurs incarnant chacun une mythologie différente. Battez-les tous les trois pour remporter la victoire et devenir le véritable Tueur de Dieux.

## Les Personnages Jouables

### Barbarian - Gros Dégâts, Fragile

**Rôle :** Damage dealer physique sans pitié  
**Attaque :** 28  
**Défense :** 8  
**Vitesse :** 11  
**Max HP :** 110  

Le Barbare frappe avec une force brute exceptionnelle. Sa capacité spéciale "Berserk" augmente ses dégâts de 30% mais le blesse lui-même (perte de 20% de ses HP max). À utiliser stratégiquement pour des dégâts massifs.

### Warrior - Tank Offensif

**Rôle :** Guerrier équilibré entre attaque et défense  
**Attaque :** 26  
**Défense :** 20  
**Vitesse :** 11  
**Max HP :** 130  

Le Guerrier est polyvalent et robuste. Il possède une défense solide tout en maintenant une attaque respectable. Idéal pour les joueurs cherchant un bon équilibre ou comme fondation d'une équipe complète.

### Paladin - Tank/Support Hybride

**Rôle :** Défenseur et soutien magique  
**Attaque :** 22  
**Défense :** 24  
**Vitesse :** 10  
**Max HP :** 120  

Le Paladin est le meilleur défenseur du jeu avec sa défense exceptionnelle. Sa capacité "Attaque Sainte" frappe tous les ennemis à la fois avec une force réduite. Excellent pour protéger l'équipe.

### Mage - Dégâts Magiques Fragiles

**Rôle :** Lanceur de sorts puissants  
**Attaque :** 13  
**Défense :** 8  
**Vitesse :** 12  
**Max HP :** 90  
**Max Mana :** 60  

Le Mage est fragile mais dévastateur. Son "Attaque Magique" inflige 25 dégâts fixes qui ignorent la défense ennemie (coût : 10 mana). Gérez votre mana avec soin pour maintenir une pluie de sorts constant.

### Priest - Guérisseur

**Rôle :** Support et guérison  
**Attaque :** 16  
**Défense :** 8  
**Vitesse :** 10  
**Max HP :** 95  

Le Prêtre est vital pour toute équipe. Sa capacité "Soin Sacré" restaure 25% des HP max d'une cible. Indispensable pour survivre aux combats prolongés et aux boss.

### Thief - Rapide et Utilitaire

**Rôle :** Speedster et voleur  
**Attaque :** 16  
**Défense :** 14  
**Vitesse :** 20  
**Max HP :** 100  

Le Voleur est le plus rapide du jeu (vitesse 20). Il peut "Voler" des objets précieux aux ennemis avec différentes probabilités. Sa rapidité lui permet d'agir en premier dans pratiquement tous les combats.

## Les Boss Majeurs

### Fenrir, Loup Ancestral (Mythologie Nordique)

**Classe :** Boss Bestial  
**Attaque :** 25 | **Défense :** 11 | **Vitesse :** 18 | **HP :** 100  

Le premier boss frappe rapidement et peut utiliser "Morsure Sauvage" pour frapper toute votre équipe. Sa rapidité le rend dangereux en début de combat.

### Méduse, Reine Gorgone (Mythologie Grecque)

**Classe :** Boss Magique  
**Attaque :** 26 | **Défense :** 10 | **Vitesse :** 14 | **HP :** 130  

Méduse incarne la magie destructive. Son "Regard Pétrifiant" ignore 30% de votre défense. Elle peut aussi utiliser "Serpents Venimeux" pour frapper l'équipe entière.

### Anubis, Gardien des Ombres (Mythologie Égyptienne)

**Classe :** Boss Divin  
**Attaque :** 28 | **Défense :** 11 | **Vitesse :** 13 | **HP :** 160  

Le plus puissant des trois, Anubis est extrêmement robuste. Son "Jugement Divin" réduit la défense de ses cibles de moitié avant de les frapper. Le combat final qui teste tous vos acquis.

## Concepts Techniques du Projet

Ce projet RPG illustre les grands principes de la programmation orientée objet :

- **Héritage :** Tous les personnages et monstres héritent de la classe `Character`
- **Polymorphisme :** Chaque classe applique sa propre stratégie d'attaque et de capacités spéciales
- **Abstraction :** Les interfaces définissent les contrats entre les classes
- **Encapsulation :** Les stats sont protégées et modifiées uniquement par des méthodes contrôlées

Le projet est développé en TypeScript.