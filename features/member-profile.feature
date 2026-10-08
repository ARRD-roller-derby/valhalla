Fonctionnalité: Consultation d'un profil de membre
  Afin de consulter l'annuaire sans interruption
  En tant qu'utilisateur authentifié
  Je veux voir un profil même si sa fiche applicative ne contient pas de rôle

  Scénario: Profil Discord sans rôle applicatif
    Étant donné qu'un membre Discord possède une fiche applicative sans clé de rôles
    Quand je consulte son profil dans l'annuaire
    Alors son profil est renvoyé avec une liste de rôles Discord
    Et aucune erreur serveur n'est renvoyée
