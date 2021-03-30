/// <reference types = "Cypress"/>
import defaultPathId from '../../utils/defaultPathId';

module.exports = (page = '', id = defaultPathId) => {
  const path = `/${id}/${page}`;
  cy.visit(path, { failOnStatusCode: false });
};
