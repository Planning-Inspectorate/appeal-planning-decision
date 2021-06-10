import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('the user is prompted for the site address', () => {
  cy.goToSiteAddressPage();
});

When(
  'the user provides their appeal site address as {string} and {string} and {string} and {string} and {string}',
  (addressLine1, addressLine2, townCity, county, postcode) => {
    cy.provideAddressLine1(addressLine1);
    cy.provideAddressLine2(addressLine2);
    cy.provideTownOrCity(townCity);
    cy.provideCounty(county);
    cy.providePostcode(postcode);
    cy.clickSaveAndContinue();
  },
);

When('the user provides a value which is too long - {string} : {int}', (component, count) => {
  const value = 'x'.repeat(count + 1);

  switch (component) {
    case 'Address Line 1':
      cy.provideAddressLine1(value);
      break;
    case 'Address Line 2':
      cy.provideAddressLine2(value);
      break;
    case 'Town or City':
      cy.provideTownOrCity(value);
      break;
    case 'County':
      cy.provideCounty(value);
      break;
    case 'Postcode':
      cy.providePostcode(value);
      break;
    default:
      throw new Error('Component ' + component + ' not found');
  }
  cy.clickSaveAndContinue();
});

When(
  'the user provides values that are too long for Address Line 1, Address Line 2, Town or City, County and Postcode',
  () => {
    const value = 'x'.repeat(70);
    cy.provideAddressLine1(value);
    cy.provideAddressLine2(value);
    cy.provideTownOrCity(value);
    cy.provideCounty(value);
    cy.providePostcode(value);
    cy.clickSaveAndContinue();
  },
);

When(
  'the user provides values that are too long for Address Line 2 and Town or City and provides no other data',
  () => {
    const value = 'x'.repeat(70);
    cy.provideAddressLine2(value);
    cy.provideTownOrCity(value);
    cy.clickSaveAndContinue();
  },
);

When('the user provides their appeal site address with postcode as {string}', (postcode) => {
  cy.providePostcode(postcode);
  cy.clickSaveAndContinue();
});

Then('the user is able to continue with the provided address', () => {
  cy.confirmSiteAddressWasAccepted();
});

Then(
  'the user is informed that they cannot continue with the provided address because {string}',
  (reason) => {
    switch (reason) {
      case 'Address Line 1 is required':
        cy.confirmSiteAddressWasRejectedBecause('Enter the first line of the address');
        break;
      case 'County is required':
        cy.confirmSiteAddressWasRejectedBecause('Enter a county');
        break;
      case 'Postcode is required':
        cy.confirmSiteAddressWasRejectedBecause('Enter a postcode');
        break;
      case 'Address Line 1 has a limit of 60 characters':
        cy.confirmSiteAddressWasRejectedBecause(
          'The first line of the address must be 60 characters or fewer',
        );
        break;
      case 'Address Line 2 has a limit of 60 characters':
        cy.confirmSiteAddressWasRejectedBecause(
          'The first line of the address must be 60 characters or fewer',
        );
        break;
      case 'Town or City has a limit of 60 characters':
        cy.confirmSiteAddressWasRejectedBecause('Town or city must be 60 characters or fewer');
        break;
      case 'County has a limit of 60 characters':
        cy.confirmSiteAddressWasRejectedBecause('County must be 60 characters or fewer');
        break;
      case 'Postcode has a limit of 8 characters':
        cy.confirmSiteAddressWasRejectedBecause('Postcode must be 8 characters or fewer');
        break;
      case "Postcodes can't be all letters":
        cy.confirmSiteAddressWasRejectedBecause('Enter a valid postcode');
        break;
      case 'Postcodes should begin with a letter':
        cy.confirmSiteAddressWasRejectedBecause('Enter a valid postcode');
        break;
      default:
        throw new Error('Reason ' + reason + ' not found');
    }
  },
);

Then('the user is informed that {string}', (reason) => {
  switch (reason) {
    case 'Address Line 1 is required':
      cy.confirmSiteAddressWasRejectedBecause('Enter the first line of the address');
      break;
    case 'Address Line 1 has a limit of 60 characters':
      cy.confirmSiteAddressWasRejectedBecause(
        'The first line of the address must be 60 characters or fewer',
      );
      break;
    case 'Address Line 2 has a limit of 60 characters':
      cy.confirmSiteAddressWasRejectedBecause(
        'The first line of the address must be 60 characters or fewer',
      );
      break;
    case 'Town or City has a limit of 60 characters':
      cy.confirmSiteAddressWasRejectedBecause('Town or city must be 60 characters or fewer');
      break;
    case 'County has a limit of 60 characters':
      cy.confirmSiteAddressWasRejectedBecause('County must be 60 characters or fewer');
      break;
    case 'County is required':
      cy.confirmSiteAddressWasRejectedBecause('Enter a county');
      break;
    case 'Postcode is required':
      cy.confirmSiteAddressWasRejectedBecause('Enter a postcode');
      break;
    case 'Postcode has a limit of 8 characters':
      cy.confirmSiteAddressWasRejectedBecause('Postcode must be 8 characters or fewer');
      break;
    default:
      throw new Error('Reason ' + reason + ' not found');
  }
});

Then(
  'the user can see that their appeal has been updated with the provided site address as {string} and {string} and {string} and {string} and {string}',
  (addressLine1, addressLine2, townCity, county, postcode) => {
    cy.confirmSiteAddressValue(addressLine1, addressLine2, townCity, county, postcode);
  },
);

Then('the user can see that their appeal has not been updated with the provided address', () => {
  cy.confirmSiteAddressValue('', '', '', '', '');
});
