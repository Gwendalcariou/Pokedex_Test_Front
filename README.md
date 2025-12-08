## **PokeDemo — TP WE (Angular)**

Auteur : Gwendal CARIOU — M1 IL CLA

## Contexte et lien avec le projet existant

Ce projet est la **suite directe** de mon premier Pokédex Angular, disponible publiquement sur mon GitHub : https://github.com/Gwendalcariou/Pokedex

La première version permettait de consulter les informations principales d’un Pokémon, ses statistiques et sa chaîne d’évolution.

Cette nouvelle version **démontre la maîtrise des tests automatisés**, en intégrant :

- une couverture complète en **tests unitaires** avec **Jest**
- un **test E2E / end-to-end** avec **Cypress**

## Résumé

Ce projet est un mini Pokédex développé dans le cadre d'un TP Angular. Il consomme la PokeAPI (https://pokeapi.co) pour afficher des fiches détaillées de Pokémon, leurs statistiques et leurs évolutions.

Principales fonctionnalités

- Affichage des informations principales d'un Pokémon (nom, id, type).
- Détails étendus : taille, poids, statistiques de base (PV, Attaque, Défense, etc.).
- Affichage des artwork (version standard et shiny lorsque disponible).
- Navigation entre évolutions et sous-évolutions.

## Capture d'écran du pokédex (Exemple de Bulbizarre)

![](public/Screenshot_1_Readme.png)
![](public/Screenshot_2_Readme.png)

## Architecture & points techniques

- Framework : Angular (v20+)
- API consommée : PokeAPI
  - `https://pokeapi.co/api/v2/pokemon/{id|name}` pour les stats et artwork
  - `https://pokeapi.co/api/v2/pokemon-species/{id|name}` pour récupérer la chaîne d'évolution

Remarque technique :
La récupération des évolutions a nécessité une étape supplémentaire car les informations d'évolution résident sur le endpoint `pokemon-species`. Le code du service a donc été adapté pour appeler successivement ces endpoints et agréger les données nécessaires à l'affichage. J'ai connu également des petites difficultés concernant les véritable artwork (en plus moderne) que j'ai récupéré sur github via un URL.

Structure du projet (extraits)

- `src/app/` : composants et services Angular
- `src/app/pokeinformations/` : composant d'affichage des fiches Pokémon
- `src/app/my-component/` : composant d'exemple
- `public/` : ressources statiques (images, placeholders)

## Tests automatisés (Jest & Cypress)

Cette section détaille **les tests unitaires** (Jest) et **les tests end-to-end** (Cypress) mis en place sur le projet, ainsi que les **modifications de code** nécessaires.

---

### 1. Tests unitaires avec Jest

#### Objectif

Les tests unitaires vérifient le comportement de chaque brique de l’application de façon isolée :

- modèles (`Pokemon`, `PokemonInformations`, etc.)
- service HTTP (`PokeAPIService`)
- pipe de filtrage (`FilterPokemonPipePipe`)
- composants (`MyComponent`, `Pokeinformations`, `App`)

Ils sont utilisés pour garantir que les **calculs, appels API et transformations de données** fonctionnent comme prévu, sans dépendre du navigateur ou de la vraie PokeAPI.

#### Fichiers de test principaux

Dans `src/app` :

- `pokemon.spec.ts` : vérification du modèle `Pokemon`
- `pokemon-composition-info.spec.ts` : comportement de `PokemonCompositionInfo`
- `filter-pokemon--pipe-pipe.spec.ts` : filtrage par nom dans une liste
- `poke-apiservice.spec.ts` : tests des appels `getPokemon`, `getPokemonInfo`, `getPokemonSpecies`, `getEvolutionChainByUrl` avec **mock HTTP**
- `app.spec.ts` : création de l’`App` et intégration minimale
- `my-component.spec.ts` :
  - chargement des Pokémons au `ngOnInit`
  - sélection d’un Pokémon et appel de `go()`
  - interaction avec `PokemonCompositionInfo`
- `pokeinformations.spec.ts` :
  - réaction aux changements d’`@Input() informations`
  - récupération de la chaîne d’évolution
  - construction des `evolutionStages`

### 2. Tests end-to-end avec Cypress

#### Objectif

Les tests **end-to-end (E2E)** valident l’application **comme un utilisateur réel** en contrôlant le navigateur.  
Contrairement aux tests unitaires qui isolent le code, Cypress teste :

- le chargement de l’application,
- l’interaction avec le formulaire de recherche,
- la recherche d’un Pokémon,
- l’appel à la PokeAPI jusqu’à l’affichage des données,
- la présence des informations clés (nom, ID, artwork, stats, évolution).

L’objectif est d’assurer que **le flux utilisateur complet fonctionne** du début à la fin.

#### Architecture des tests Cypress

Les tests Cypress sont organisés comme suit :

- `cypress/e2e/` : fichiers de spécification E2E (scénarios utilisateurs)
- `cypress/fixtures/` : données de test (mocks) éventuelles
- `cypress/support/` : configuration globale et commandes personnalisées

Le test principal (par ex. `pokedex.cy.ts`) couvre le parcours utilisateur de base sur le Pokédex.

#### Scénarios principaux testés

Les scénarios permettent de vérifier que l’interface affiche correctement les données retournées par l’API :

1. **Chargement de la page d’accueil**

   - Vérification que l’application Angular démarre sans erreur.
   - Présence des éléments principaux : titre, champ de recherche, bouton de validation.

2. **Recherche d’un Pokémon**

   - Saisie d’un nom ou identifiant dans le champ de recherche.
   - Clic sur le bouton de recherche (ou validation clavier).
   - Vérification de la navigation / mise à jour de la vue vers la fiche du Pokémon.

3. **Affichage de la fiche Pokémon**

   - Vérification de la présence de la carte avec `data-cy="pokemon-card"`.
   - Présence du nom du Pokémon, de son identifiant et de ses types.
   - Affichage de la taille, du poids et des artwork (standard et shiny si disponibles).

4. **Statistiques et évolutions**
   - Présence de la section des statistiques de base.
   - Présence de la section « Évolutions » :
     - Affichage de la ligne d’évolution lorsque le Pokémon possède des évolutions.
     - Affichage du message `— Aucune évolution —` pour les Pokémons sans évolution.

Ces tests valident que **l’ensemble des composants testés unitairement (services, composants, pipes)** fonctionnent correctement dans un vrai navigateur avec la vraie API.

---

### 3. Comment exécuter les tests

#### 3.1. Exécuter les tests unitaires (Jest)

Pour lancer les tests unitaires Jest :

```bash
npm test
```

Pour lancer les tests avec le rapport de couverture :

```bash
npm test --coverage
```

Ces commandes exécutent l’ensemble des fichiers de test `*.spec.ts` présents dans `src/app/`.

#### 3.2. Exécuter les tests end-to-end (Cypress)

Les tests Cypress se lancent via le script suivant :

```bash
npm run cypress
```
