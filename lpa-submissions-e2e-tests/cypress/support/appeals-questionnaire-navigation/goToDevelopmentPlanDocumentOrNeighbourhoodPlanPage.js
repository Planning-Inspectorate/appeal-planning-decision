 /// <reference types = "Cypress"/>
import defaultPathId from '../../utils/defaultPathId';

module.exports = (id = defaultPathId) => {
  const path = `/${id}/placeholder`;
  cy.visit(path, {failOnStatusCode:false});
  cy.checkA11y(path);
}
