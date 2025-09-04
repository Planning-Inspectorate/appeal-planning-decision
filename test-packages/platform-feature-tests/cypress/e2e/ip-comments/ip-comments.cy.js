// @ts-nocheck
/// <reference types="cypress"/>
//import { users } from '../../fixtures/users.js';
import { ipCommentsForPostCode, ipCommentsForAppealRef } from "../../support/flows/sections/ipComments/ipComments";
describe('Comment on a planning appeal', { tags: '@IP-Comments-Submission' }, () => {
  let prepareAppealData;
  // before(() => {
  //   cy.login(users.appeals.authUser);
  // });
  beforeEach(() => {
    cy.fixture('prepareAppealData').then(data => {
      prepareAppealData = data;
    })
  })

  it('should allow a user to enter postcode and submit the IP comments', () => {

    ipCommentsForPostCode(prepareAppealData, 'SW7 9PB');
  });

  // it('should allow a user to enter a reference number and submit the IP comment', () => {

  //   ipCommentsForAppealRef(6022482);
  // });
});