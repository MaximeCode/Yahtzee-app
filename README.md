# Yahtzee Game

Une reproduction du célèbre jeu de société Yahtzee développée avec React. Cette application web permet aux joueurs de profiter de l'expérience Yahtzee dans un environnement numérique moderne.

## 🎲 Aperçu

Le Yahtzee est un jeu de dés où les joueurs lancent 5 dés et tentent de réaliser différentes combinaisons pour marquer des points. Cette version numérique reproduit fidèlement les règles et l'expérience du jeu original.

## 📁 Structure du Projet

```
YAHTZEE-APP
├── backend/
│   ├── add_scores.php
│   ├── get_scores.php
│   └── mysql.php
├── database/
│   ├── Yahtzee.sql
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
├── .env
└── ...
```

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

## ⚙️ Installation

1. Clonez le repository

```bash
git clone https://github.com/MaximeCode/Yahtzee_game.git
```

2. Installez les dépendances frontend

```bash
cd frontend
npm install
```

3. Configurez la base de données

- Créez une base de données MySQL/MariaDB

```sql
CREATE DATABASE Yahtzee;
```

- Importez le fichier de dump :

```bash
mysql -u votre_utilisateur -p Yahtzee < database/yahtzee.sql
```

4. Configuration de l'environnement

- Copiez le fichier `.env.example` vers `.env`

```bash
cp .env.example .env
```

- Modifiez les variables dans `.env` avec vos informations :

```env
DB_HOST=votre_host
DB_PORT=3306
DB_NAME=Yahtzee
DB_USER=votre_user
DB_PASSWORD=votre_password
```

5. Lancez l'application en mode développement

```bash
npm start
```

6. Lancer le backend pour recevoir et envoyer les scores vers la base de données  
<sub>*Si php n'est pas installé, utiliser un serveur web comme XAMPP ou Laragon mais il faudra déplacer les fichiers php et donc modifier les url dans le projet !)*[^1]</sub>

```bash
cd backend
php -S localhost:8000
```

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

[^1]: My reference.
