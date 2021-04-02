import defaultPathId from '../../utils/defaultPathId';

module.exports = (url, id = defaultPathId) => {
    const path = `/${id}/${url}`;
    cy.visit(path, {failOnStatusCode:false});
 };
