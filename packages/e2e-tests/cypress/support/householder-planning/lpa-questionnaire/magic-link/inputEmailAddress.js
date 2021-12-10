import { v4 as uuidv4 } from 'uuid';
import { input } from '../PageObjects/common-page-objects';

export const inputEmailAddress = (emailAddress) => {
  const email =
    emailAddress !== undefined ? emailAddress : `${uuidv4()}.user@planninginspectorate.gov.uk`;
  cy.wrap(email).as('lpaEmail');
  if (emailAddress === '') {
    input('lpa-authentication-email').invoke('val', '');
  } else {
    input('lpa-authentication-email').type(email);
  }
};
