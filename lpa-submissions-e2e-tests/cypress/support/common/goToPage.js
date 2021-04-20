module.exports = (url, id) => {
  if (id) {
    const path = `/${id}/${url}`;
    cy.visit(path, {failOnStatusCode:false});
  } else {
    cy.get('@appeal').then( (appeal) => {
      const path = `/${appeal.id}/${url}`;
      cy.visit(path, {failOnStatusCode:false});
    });
  }
 };
