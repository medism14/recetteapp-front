## Prérequis

- Node.js (version recommandée)
- NPM
- Backend lancé sur le port 3001

## Installation des dépendances:
### Assurez-vous tout d'abord d'installer les dépendances nécessaires

```bash
npm install
```

## Serveur de développement

### Pour lancer le serveur en localhost `http://localhost:3000`:

```bash
# npm
npm run dev
```

## Build de l'application

### Pour construire l'application, exécutez la commande ci-dessous:

```bash
npm run build
```

## Structure de l'application

### Pages publiques
* Connexion ("/login")
* Inscription ("/register")


### Pages authentifiées
* Accueil ("/")
* Gestion des recettes
  * Liste des recettes ("/my-recipes")
  * Ajout de recette ("/my-recipes/add-recipe")
  * Édition de recette ("/my-recipes/edit-recipe/:id")
  * Détails de la recette ("/recipe-detail/:id")
* Recherche ("/search")

<br />

## Informations à connaître à propos de l'application

* Assurez-vous de lancer le backend sur le port `3001`, si vous changez de port n'oubliez pas de le changer dans le fichier `.env`.
* L'application est sécurisée avec un cookie HttpOnly qui vous sera retourné par le backend.