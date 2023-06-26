export const getIsListedBuilding = () => cy.get('input[data-cy="answer-full-planning"]');
export const getIsNotListedBuilding = () => cy.get('input[data-cy="answer-listed-building"]');
export const getListedBuildingDecisionError = () => cy.get('#listed-building-householder-error');
