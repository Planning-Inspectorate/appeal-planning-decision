const create = () => {
  cy.request(
    'POST',
    `${Cypress.env('APPEAL_SERVICE_BASE_URL')}`,
  ).then(response => {
    expect(response.status).to.equal(201, 'expect a happy response from the appeal-api.create');
    return response.body;
  });
}

const update = (appeal) => {
  cy.request(
    'PUT',
    `${Cypress.env('APPEAL_SERVICE_BASE_URL')}/${appeal.id}`,
    appeal
  ).then(response => {
    expect(response.status).to.equal(200, 'expect a happy response from the appeal-api.update');
    return response.body;
  });
}

const insert = (providedAppeal) => {
  return cy.createAppeal().then( (createdAppeal) => {
      return cy.updateAppeal({
        ...createdAppeal,
        ...providedAppeal,
      })
    })
}


module.exports = {
  create,
  update,
  insert,
}
