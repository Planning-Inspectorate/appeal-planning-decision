import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

function givenAlreadySubmittedandWholeSiteOwner(isAlreadySubmitted, isWholeSiteOwner) {
  cy.goToWholeSiteOwnerPage();

  if (isAlreadySubmitted) {
    if (isWholeSiteOwner) {
      cy.answerOwnsTheWholeAppeal();
    } else {
      cy.answerDoesNotOwnTheWholeAppeal();
    }
    cy.clickSaveAndContinue();
    cy.goToWholeSiteOwnerPage();
  }
}

function stateOwnSiteOwner(isWholeOwner) {
  if (isWholeOwner) {
    cy.answerOwnsTheWholeAppeal();
  } else {
    cy.answerDoesNotOwnTheWholeAppeal();
  }
  cy.clickSaveAndContinue();
}

function stateOtherOwnersBeenTold(areOtherOwnersTold) {
  if (areOtherOwnersTold) {
    cy.answerHaveToldOtherOwnersAppeal();
  } else {
    cy.answerHaveNotToldOtherOwnersAppeal();
  }
  cy.clickSaveAndContinue();
}

function isOtherOwnerPresented(isAsked) {
  if (isAsked) {
    cy.confirmOtherOwnersAsked();
  } else {
    cy.confirmSiteOwnershipAccepted();
  }
}

function isComponentUpdated(component, value) {
  switch (component) {
    case 'site ownership':
      cy.confirmWholeSiteOwnerAnswered(value);
      break;
    case 'other owners told':
      cy.confirmOtherSiteOwnerToldAnswered(value);
      break;
    default:
      throw new Error('Component ' + component + ' unknown');
  }
}

Given('the site ownership is presented for the first time', () => {
  givenAlreadySubmittedandWholeSiteOwner(false);
});

Given('the whole site had previously been confirmed as owned', () => {
  givenAlreadySubmittedandWholeSiteOwner(true, true);
});

Given('the whole site had previously been confirmed as not owned', () => {
  givenAlreadySubmittedandWholeSiteOwner(true, false);
});

Given('confirmation of additional site owners notification is requested', () => {
  givenAlreadySubmittedandWholeSiteOwner(true, false);
  cy.clickSaveAndContinue();
});

When('the user does not state being or not the whole site owner', () => {
  cy.clickSaveAndContinue();
});

When('the user does not state if other owners have been told', () => {
  cy.clickSaveAndContinue();
});

When('no confirmation is provided that the whole site is owned', () => {
  cy.clickSaveAndContinue();
});

When('no confirmation of notification of additional site owners is provided', () => {
  cy.clickSaveAndContinue();
});

When('it is confirmed that the whole site is owned', () => {
  stateOwnSiteOwner(true);
});

When('it is confirmed that the whole site is not owned', () => {
  stateOwnSiteOwner(false);
});

When('it is confirmed that additional site owners have been notified', () => {
  stateOtherOwnersBeenTold(true);
});
When('it is confirmed that additional site owners have not been notified', () => {
  stateOtherOwnersBeenTold(false);
});

Then('a request to notify additional owners is presented', () => {
  isOtherOwnerPresented(true);
});

Then('a request to notify additional owners is not presented', () => {
  isOtherOwnerPresented(false);
});

Then('a request to confirm access to the site is presented', () => {
  isOtherOwnerPresented(false);
});

Then('confirmation of whole site ownership is requested', () => {
  cy.confirmSiteOwnershipRejectedBecause('Select yes if you own the whole appeal site');
  cy.confirmWholeSiteOwnerAnswered('blank');
});

Then('confirmation of notification of additional site owners is requested', () => {
  cy.confirmSiteOwnershipRejectedBecause('Select yes if you have told the other owners');
  cy.confirmOtherSiteOwnerToldAnswered('blank');
});

Then('the site is updated to be wholly owned on the appeal', () => {
  isComponentUpdated('site ownership', 'yes');
  isComponentUpdated('other owners told', 'blank');
});

Then('the site is updated to not be wholly owned on the appeal', () => {
  isComponentUpdated('site ownership', 'no');
});

Then('the site is updated so that other owners been notified on the appeal', () => {
  isComponentUpdated('other owners told', 'yes');
});
Then('the site is updated so that other owners have not been notified on the appeal', () => {
  isComponentUpdated('other owners told', 'no');
});
