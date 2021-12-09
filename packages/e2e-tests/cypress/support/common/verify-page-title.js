import { getPageTitle } from '../common-page-objects/common-po';

export const verifyPageTitle = (pageTitle) =>{
  getPageTitle().should('eq', pageTitle);
}
