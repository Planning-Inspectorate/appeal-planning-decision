import uuid from 'uuid';

module.exports = (emailAddress) => {
  const email =
    emailAddress !== undefined ? emailAddress : `${uuid.v4()}.user@planninginspectorate.gov.uk`;
  cy.wrap(email).as('lpaEmail');
};
