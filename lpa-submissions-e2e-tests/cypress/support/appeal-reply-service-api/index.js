const create = (appealId) =>{
  cy.request(
    'POST',
    `${Cypress.env('APPEAL_REPLY_SERVICE_BASE_URL')}`,
    {appealId}
  ).then(response => {
    expect(response.status).to.equal(201, 'expect a happy response from the appeal-reply-api.create');
    return response.body;
  });
}

const update = (appealReply) => {
  cy.request(
    'PUT',
    `${Cypress.env('APPEAL_REPLY_SERVICE_BASE_URL')}/${appealReply.appealId}`,
    appealReply,
  ).then(response => {
    expect(response.status).to.equal(200, 'expect a happy response from the appeal-reply-api.update');
    return response.body;
  });
}

const insert = (providedAppealReply) => {
  return cy.createAppealReply(providedAppealReply.appealId).then( (createdAppealReply) => {
      return cy.updateAppealReply({
        ...createdAppealReply,
        ...providedAppealReply,
      })
    })
}

const insertAppealAndCreateReply = (providedAppeal, providedReply) => {

  if (providedAppeal) {
    cy.insertAppeal(providedAppeal).as('appeal')
  } else {
    cy.createAppeal().as('appeal');
  }

  cy.get('@appeal').then( (newAppeal) => {
    if (providedReply) {
      cy.insertAppealReply({
        ...providedReply,
        appealId: newAppeal.id,
      }).as('appealReply')
    } else {
      cy.createAppealReply( newAppeal.id ).as('appealReply');
    }
  })

  return cy.get('@appealReply');
}

module.exports = {
  create,
  update,
  insert,
  insertAppealAndCreateReply,
}
