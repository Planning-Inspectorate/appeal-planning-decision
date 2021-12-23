import { clickBackLink } from './clickBackLink';

export const clickBackLinkAndValidateUrl = ({ expectedUrl }) => {
  clickBackLink();

  cy.url().should('match', expectedUrl);
};
