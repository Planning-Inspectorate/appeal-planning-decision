import defaultPathId from '../../utils/defaultPathId';

module.exports = (url, id = defaultPathId, disableJs) => {
  const path = `/${id}/${url}`;
  cy.visit(path, { failOnStatusCode: false, script: !disableJs });
};
