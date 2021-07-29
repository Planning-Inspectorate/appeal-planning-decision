import uuid from 'uuid';
import { input } from '../PageObjects/common-page-objects';

module.exports = (emailAddress) => {
  const email =
    emailAddress !== undefined ? emailAddress : `${uuid.v4()}.user@planninginspectorate.gov.uk`;
  cy.wrap(email).as('lpaEmail');
  input('lpa-authentication-email').type(email);
};
