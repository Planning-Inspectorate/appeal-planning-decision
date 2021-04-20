module.exports = (url, id, disableJs) => {
  if (id) {
    const path = `/${id}/${url}`;
    cy.visit(path, {
      failOnStatusCode:false,
      script: !disableJs,
    });
  } else {
    cy.get('@appeal').then( (appeal) => {
      const path = `/${appeal.id}/${url}`;
      cy.visit(path, {
        failOnStatusCode:false,
        script: !disableJs,
      });
    });
  }
 };
