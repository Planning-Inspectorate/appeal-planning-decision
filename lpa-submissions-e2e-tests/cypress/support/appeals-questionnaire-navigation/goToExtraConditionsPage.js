 /// <reference types = "Cypress"/>
import defaultPathId from '../../utils/defaultPathId';

module.exports = (id = defaultPathId) => {
  const path = `/${id}/extra-conditions`;
  cy.visit(path, {failOnStatusCode:false});
  cy.checkPageA11y(path);
}
