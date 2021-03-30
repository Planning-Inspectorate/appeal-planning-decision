Then('the appeal details panel is displayed on the right hand side of the page', () => {
  cy.verifyAppealDetailsSidebar({
    applicationNumber: 'ABC/123',
    applicationAddress: '999 Letsby Avenue, Sheffield, South Yorkshire, S9 1XY',
    apellantName: 'Bob Smith',
  });
});
