// @ts-nocheck
/// <reference types="cypress"/>

import { ipCommentsForPostCode, ipCommentsForAppealRef } from "../../support/flows/sections/ipComments/ipComments";
describe('Comment on a planning appeal', { tags: '@IP-Comments-Submission' }, () => {
  let prepareAppealData;
  beforeEach(() => {
    cy.fixture('prepareAppealData').then(data => {
      prepareAppealData = data;
    })
  })

  it('should allow a user to enter postcode and submit the IP comments', () => {

    ipCommentsForPostCode(prepareAppealData, 'SW7 9PB');
  });

});