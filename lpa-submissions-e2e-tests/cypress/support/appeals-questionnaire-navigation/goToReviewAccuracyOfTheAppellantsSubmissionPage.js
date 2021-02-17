 /// <reference types = "Cypress"/>
import defaultPathId from '../../utils/defaultPathId';

module.exports = (id = defaultPathId) => {
  const path = `/${id}/accuracy-submission`;
  cy.visit(path, {failOnStatusCode:false});
  cy.checkPageA11y(path);
}
