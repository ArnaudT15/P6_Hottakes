#P6_Hottakes

P6 Openclassrooms


### Pré-requis


    NodeJS 12.14 or 14.0.
    Angular CLI 7.0.2.
    node-sass : make sure to use the corresponding version to NodeJS. For Noe 14.0 for instance, you need node-sass in version 4.14+.
    Une base de données MongoDB

### Installation

run npm install, and run npm install --save-dev run-script-os

## Démarrage

- Dans le dossier backend, créez un dossier images
- Créez un fichier dev.env à la racine du dossier backend
- Remplissez le de la maniere suivante:
NODE_ENV=dev
JWT_TOKEN= `une suite de caractere de votre choix pour parametrer jsonwebtoken`
MONGO_DB_HOST= `L'host de votre base de données MongoDB`
MONGO_DB_USERNAME=`Le nom d'utilisateur de votre Bdd MongoDB`
MONGO_DB_PASSWORD=`Le mot de passe de la bdd`
MONGO_DB_NAME=`Le nom de la bdd`
HOST=`votre adresse pour host, mettez localhost si vous souhaitez l'utiliser en local`
PORT=`le port de votre choix poour le serveur`
- Ouvrez enfin un terminal et rentrez la commande node server.

- Tout est pret.
