module.exports = (task, status) => {
  cy.get('[' + task.replace(/[ ]+/g, '').toLowerCase() + '-status="' + status + '"]').should(
    'have.length',
    1,
  );

  cy.snapshot();
};
