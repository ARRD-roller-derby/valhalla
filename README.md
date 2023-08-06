![Valhalla](https://valhalla.arrd.fr/favicon.ico)

## Valhalla

Description
Valhalla est une application web conçue pour faciliter la gestion d'un club de derby, bien qu'elle puisse être adaptée à d'autres sports. L'application offre plusieurs fonctionnalités avancées pour la gestion d'événements, le suivi des membres dans leur progression et propose des jeux pour apprendre le sport de manière ludique.

## Couplage à Discord

Valhalla utilise Discord pour l'authentification des utilisateurs. L'application est prévue pour utiliser les rôles Discord pour attribuer des autorisations et des privilèges aux membres du club de derby. Lorsqu'un utilisateur se connecte à Valhalla, son rôle Discord est associé à son compte d'utilisateur dans l'application, ce qui permet de déterminer les fonctionnalités et les actions auxquelles il a accès.

De plus, les notifications in-app sont déportées sur des canaux Discord ou envoyées sous forme de messages privés aux utilisateurs concernés. Cela permet de centraliser les communications et de garder les membres du club informés des événements, des mises à jour et des activités importantes.

Le couplage à Discord offre une expérience utilisateur fluide et harmonieuse en intégrant étroitement l'application Valhalla avec la plateforme de communication préférée des joueurs.

## Fonctionnalités principales

- Gestion avancée des événements : Créez, planifiez et suivez les événements du club de derby, tels que les entraînements, les matchs, les tournois, etc. L'application offre des fonctionnalités complètes pour gérer les participants, les horaires, les lieux, et plus encore.

- Suivi des membres : Suivez les progrès individuels des membres du club dans leur pratique du derby. L'application permet de suivre les performances, les compétences acquises et les objectifs atteints par chaque membre.

- Jeux d'apprentissage : Valhalla propose des jeux interactifs pour aider les membres à apprendre le sport de manière ludique et divertissante. Ces jeux sont conçus pour améliorer les compétences et les connaissances des joueurs.

## Installation

Pour installer et exécuter l'application Valhalla, suivez les étapes ci-dessous :

Clonez le dépôt Git de l'application sur votre machine locale.

```bash
git clone git@github.com:ARRD-roller-derby/valhalla.git
```

Installez les dépendances en utilisant `pnpm`.

```bash
pnpm install
```

Configurez les services externes nécessaires, tels que [MongoDB](https://www.mongodb.com/fr-fr) et [Pusher](https://pusher.com/), ou encore [Open Meteo](https://api.open-meteo.com). Consultez la documentation de chaque service pour obtenir des instructions détaillées sur la configuration.

Créez un fichier .env.local à la racine du projet et ajoutez les variables d'environnement nécessaires. Assurez-vous de fournir les clés d'accès et les identifiants requis pour les services externes.

Exemple de contenu du fichier .env.local :

```bash
PUSHER_SECRET_KEY=
PUSHER_INSTANCE_ID=
PUSHER_APP_ID=

S3_DOMAIN=
S3_KEY=
S3_BUCKET=
S3_REGION=
S3_PUBLIC_ENDPOINT=
S3_ENDPOINT=
S3_PRIVATE=

PUSHER_APP_SECRET=
NEXT_PUBLIC_PUSHER_APP_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=
NEXTAUTH_URL=
NEXTAUTH_SECRET=

MONGO_URI=

DISCORD_NEWS_HOOK=
DISCORD_EVENT_HOOK=
DISCORD_ADMIN_HOOK=

DISCORD_TOKEN=
DISCORD_CLIENT_ID=
DISCORD_GUILD_ID=
DISCORD_CLIENT_SECRET=

CHAT_GPT_API=

PUSHER_SECRET=
NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_API_ID=
NEXT_PUBLIC_PUSHER_REGION=

WEATHER_API_URL=
```

## Accès à l'application

Une fois que vous avez lancé l'application en mode développement, vous pouvez y accéder dans votre navigateur en utilisant l'adresse suivante : [http://localhost:3000](http://localhost:3000).
