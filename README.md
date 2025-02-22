# Yahtzee Game

Une reproduction du célèbre jeu de société Yahtzee développée avec React. Cette application web permet aux joueurs de profiter de l'expérience Yahtzee dans un environnement numérique moderne.

## 🎲 Aperçu

Le Yahtzee est un jeu de dés où les joueurs lancent 5 dés et tentent de réaliser différentes combinaisons pour marquer des points. Cette version numérique reproduit fidèlement les règles et l'expérience du jeu original.  

Mon projet est disponible partout à l'adresse suivante, déployer par `Vercel` : https://yahtzee-app.vercel.app/

## 📁 Structure du Projet

```
YAHTZEE-APP
├── backend/
│   ├── _config.php
│   ├── add_scores.php
│   ├── get_scores.php
│   └── mysql.php
├── database/
│   ├── yahtzee.sql
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── Components/
│       ├── Pages/
│       │   ├── Game.jsx
│       │   ├── Home.jsx
│       │   └── Scores.jsx
│       └── styles/
└── ...
```

## ⚙️ Installation

1. Clonez le repository

    ```bash
    git clone https://github.com/MaximeCode/Yahtzee-app.git
    ```

2. Installez les dépendances frontend

    ```bash
    cd Yahtzee-app/frontend
    npm install
    ```

3. Configurez la base de données

    - Importez le fichier de dump :
      ```bash
      scp database/yahtzee.sql votre_user@votre_host:/home
      ```

    - Sur votre serveur, créez une base de données MySQL/MariaDB :
      ```sql
      CREATE DATABASE Yahtzee;
      ```
      
    - Intégrer ce fichier dans la base de données précédemment créée :
      ```bash
      cd home
      mysql -u votre_utilisateur -p Yahtzee < yahtzee.sql
      ```

5. Configuration de la connexion à la base de données

    - Dans le dossier `backend`, Renommer le fichier `_config.ex.php` en `_config.php`
    - Modifiez les variables dans `_config.php` avec vos informations.

6. Lancez l'application en mode développement

    ```bash
    npm start
    ```

7. Lancer le backend pour recevoir et envoyer les scores vers la base de données  
<sub>*Si php n'est pas installé, utiliser un serveur web comme XAMPP ou Laragon mais il faudra déplacer les fichiers php et donc modifier les url dans le projet !* [^1]</sub>

    ```bash
    cd ../backend
    php -S localhost:8000
    ```

   ### Votre application est prête !
   PS : Je vous mets au défi de battre un score de 350 pts !

   *Bonne chance !* 😉

## 🚀 Technologies Utilisées

- React 18.3.1
- Bootstrap 5.3.3
- SASS 1.77.8
- React Router DOM 6.25.1
- React Bootstrap 2.10.4
- Styled Components 6.1.12
- PHP (Backend)
- MariaDB/MySQL

## 🎨 Palette de Couleurs

```scss
$main-color: wheat;
$bg-color: #4d4735;
$btn-bg-color: black;
$btn-hover-bg-color: #266041;
$highlight-color: #4caf50;
```

## 📜 Typographie

- Police principale : Georgia, serif

## 🎮 Fonctionnalités

- Interface utilisateur intuitive
- Système de score automatique
- Design responsive
- Thème visuel personnalisé
- Stockage des scores en base de données
- Classement des joueurs

## 💾 Base de Données

L'application utilise une base de données relationnelle pour stocker les scores des joueurs.

### Structure

Le fichier de dump (`database/yahtzee.sql`) contient :

- La structure complète de la base de données
- Les tables nécessaires
- Des données initiales de test (dont l'un de mes meilleurs scores ! Pourrez-vous me battre ? Bonne chance !😉)

### Fonctionnalités Base de Données

- Stockage permanent des scores
- Classement des meilleurs joueurs

## 📝 Contexte et Perspectives

Ce projet a été développé durant l'été 2024 dans le cadre de mon parcours d'apprentissage en tant que développeur web junior. Il représente ma première immersion approfondie dans l'écosystème React et m'a permis de :

- Maîtriser les concepts fondamentaux de React
- Développer une application complète de bout en bout
- Gérer la logique complexe d'un jeu de société
- Pratiquer l'intégration de bibliothèques externes

### Apprentissages clés

- Gestion des états avec React
- Manipulation des événements
- Structuration d'une application React
- Intégration de styles avec SASS et Bootstrap
- Gestion d'une base de données avec PHP/MySQL

### Perspectives d'évolution

Je prévois de développer une série de jeux de société en ligne en utilisant des technologies plus récentes :

- Migration vers Next.js
- Adoption de TailwindCSS
- Intégration d'une base de données plus moderne
- Implémentation de fonctionnalités multijoueurs

## 🛠️ En Développement

Ce projet est actuellement en développement passif. Lorsque j'ai du temps, j'essaie d'intégrer de nouvelles fonctionnalités et améliorations 🔧

## 🎯 À Venir

- Mise en production de cette version sur `Vercel`
- Mode multijoueur
- Animations améliorées


## Annexes

[^1]: 
Pages à modifier en cas d'utilisation d'un serveur web comme XAMPP ou Laragon :
- `frontend\src\Pages\Scores.jsx`
- `frontend\src\Pages\Game.jsx`
