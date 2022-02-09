export const completeDeterministicFullAppeal = () => {
  cy.request('POST', `${Cypress.env('APPEAL_SERVICE_BASE_URL')}/appeals`).then((response) => {
    expect(response.status).to.equal(201, 'expect a happy response from the appeal-api.create');
    const appeal = response.body;
    cy.fixture('completedDeterministicFullAppeal.json').then((appealData) => {
      appealData.id = appeal.id;
      cy.request(
        'PUT',
        `${Cypress.env('APPEAL_SERVICE_BASE_URL')}/appeals/${appeal.id}`,
        appealData,
      ).then((response) => {
        expect(response.status).to.equal(200, 'expect a happy response from the appeal-api.update');
        cy.wrap(response.body).as('fullAppeal');
      });
    });
  });
};
