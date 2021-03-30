/// <reference types = "Cypress"/>
import defaultPathId from '../../utils/defaultPathId';

module.exports = (page = '', subdirectory = defaultPathId) => {
  const path = `/${subdirectory}/${page}`;
  cy.visit(path, {failOnStatusCode:false});
  cy.checkPageA11y(path);
}
