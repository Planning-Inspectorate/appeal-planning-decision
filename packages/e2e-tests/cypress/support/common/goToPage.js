module.exports = (url, id, disableJs) => {

  if (id) {
    cy.visit(`/${id}/${url}`, {
      failOnStatusCode: false,
      script: !disableJs,
    });
  } else {
    cy.get('@appeal').then((appeal) => {
      cy.visit(`/${appeal.id}/${url}`, {
        failOnStatusCode: false,
        script: !disableJs,
      });
    });
  }
  cy.htmlvalidate();
};
