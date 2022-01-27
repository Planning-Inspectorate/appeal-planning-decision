export const selectYes = () => cy.get('[data-cy="answer-yes"]');
export const selectNo = () => cy.get('[data-cy="answer-no"]');
export const selectSomeOf = () => cy.get('[data-cy="answer-some"]');
export const errorMessageOwnAllLand = () => cy.get('#own-all-the-land-error');
export const errorMessageOwnSomeLand = () => cy.get('#own-some-of-the-land-error');
export const errorMessageKnowTheOwners = () => cy.get('#know-the-owners-error');
export const errorMessageAgriculturalHolding = () => cy.get('#agricultural-holding-error');
export const hintTextAgriculturalHolding = () => cy.get('#agricultural-holding-hint');
export const errorMessageAreYouATenant = () => cy.get('#are-you-a-tenant-error');
export const errorMessageOtherTenants = () => cy.get('#other-tenants-error');

