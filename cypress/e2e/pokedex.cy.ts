import 'cypress';

describe('Pokedex E2E', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('permet de sélectionner un Pokémon et d’afficher sa fiche', () => {
    // 1) On s’assure que la liste est bien chargée (le mat-select existe)
    cy.get('[data-cy=pokemon-select]').should('exist');

    // 2) On tape un terme de recherche (par ex. "bulba")
    cy.get('[data-cy=search-input]').type('bulba');

    // 3) On ouvre la liste déroulante
    cy.get('[data-cy=pokemon-select]').click();

    // 4) On choisit Bulbasaur dans les options
    cy.get('mat-option').contains(/bulbasaur/i).click();

    // 5) Le bouton GO ne doit plus être désactivé
    cy.get('[data-cy=go-button]').should('not.be.disabled');

    // 6) On clique sur GO
    cy.get('[data-cy=go-button]').click();

    // 7) La fiche du Pokémon doit apparaître
    cy.get('[data-cy=pokemon-card]').should('be.visible');

    // 8) On vérifie quelques infos de base
    cy.get('[data-cy=pokemon-card]').within(() => {
      cy.contains('#1 · Bulbasaur');        
      cy.contains(/Base stats/i);           
      cy.contains(/Evolutions/i);           
    });
  });
});
