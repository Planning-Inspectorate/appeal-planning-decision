import { getPageTitle } from '../page-objects/common-po';

export const verifyPageTitle = (pageTitle) =>{
  getPageTitle().should('eq', pageTitle);
}
