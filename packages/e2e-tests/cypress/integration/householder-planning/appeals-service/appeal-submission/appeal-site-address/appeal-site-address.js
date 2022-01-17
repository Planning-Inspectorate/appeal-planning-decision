import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { provideAddressLine1 } from '../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine1';
import { provideAddressLine2 } from '../../../../../support/common/appeal-submission-appeal-site-address/provideAddressLine2';
import { provideTownOrCity } from '../../../../../support/common/appeal-submission-appeal-site-address/provideTownOrCity';
import { provideCounty } from '../../../../../support/common/appeal-submission-appeal-site-address/provideCounty';
import { providePostcode } from '../../../../../support/common/appeal-submission-appeal-site-address/providePostcode';
import { clickSaveAndContinue } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { confirmSiteAddressWasAccepted } from '../../../../../support/common/appeal-submission-appeal-site-address/confirmSiteAddressWasAccepted';
import { confirmSiteAddressWasRejectedBecause } from '../../../../../support/common/appeal-submission-appeal-site-address/confirmSiteAddressWasRejectedBecause';
import { confirmSiteAddressValue } from '../../../../../support/common/appeal-submission-appeal-site-address/confirmSiteAddressValue';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from '../../../../common/householder-planning/appeals-service/pageURLAppeal';

Given('the user is prompted for the site address', () => {
  //goToSiteAddressPage();
  goToAppealsPage(pageURLAppeal.goToSiteAddressPage);
});

When(
  'the user provides their appeal site address as {string} and {string} and {string} and {string} and {string}',
  (addressLine1, addressLine2, townCity, county, postcode) => {
    provideAddressLine1(addressLine1);
    provideAddressLine2(addressLine2);
    provideTownOrCity(townCity);
    provideCounty(county);
    providePostcode(postcode);
    clickSaveAndContinue();
  },
);

When('the user provides a value which is too long - {string} : {int}', (component, count) => {
  const value = 'x'.repeat(count + 1);

  switch (component) {
    case 'Address Line 1':
      provideAddressLine1(value);
      break;
    case 'Address Line 2':
      provideAddressLine2(value);
      break;
    case 'Town or City':
      provideTownOrCity(value);
      break;
    case 'County':
      provideCounty(value);
      break;
    case 'Postcode':
      providePostcode(value);
      break;
    default:
      throw new Error('Component ' + component + ' not found');
  }
  clickSaveAndContinue();
});

When(
  'the user provides values that are too long for Address Line 1, Address Line 2, Town or City, County and Postcode',
  () => {
    const value = 'x'.repeat(70);
    provideAddressLine1(value);
    provideAddressLine2(value);
    provideTownOrCity(value);
    provideCounty(value);
    providePostcode(value);
    clickSaveAndContinue();
  },
);

When(
  'the user provides values that are too long for Address Line 2 and Town or City and provides no other data',
  () => {
    const value = 'x'.repeat(70);
    provideAddressLine2(value);
    provideTownOrCity(value);
    clickSaveAndContinue();
  },
);

When('the user provides their appeal site address with postcode as {string}', (postcode) => {
  providePostcode(postcode);
  clickSaveAndContinue();
});

Then('the user is able to continue with the provided address', () => {
  confirmSiteAddressWasAccepted();
});

Then(
  'the user is informed that they cannot continue with the provided address because {string}',
  (reason) => {
    switch (reason) {
      case 'Address Line 1 is required':
        confirmSiteAddressWasRejectedBecause('Enter the first line of the address');
        break;
      case 'Postcode is required':
        confirmSiteAddressWasRejectedBecause('Enter a real postcode');
        break;
      case 'Address Line 1 has a limit of 60 characters':
        confirmSiteAddressWasRejectedBecause(
          'The first line of the address must be 60 characters or fewer',
        );
        break;
      case 'Address Line 2 has a limit of 60 characters':
        confirmSiteAddressWasRejectedBecause(
          'The second line of the address must be 60 characters or fewer',
        );
        break;
      case 'Town or City has a limit of 60 characters':
        confirmSiteAddressWasRejectedBecause('Town or City must be 60 characters or fewer');
        break;
      case 'County has a limit of 60 characters':
        confirmSiteAddressWasRejectedBecause('County must be 60 characters or fewer');
        break;
      case 'Postcode has a limit of 8 characters':
        confirmSiteAddressWasRejectedBecause('Postcode must be 8 characters or fewer');
        break;
      case "Postcodes can't be all letters":
        confirmSiteAddressWasRejectedBecause('Enter a real postcode');
        break;
      case 'Postcodes should begin with a letter':
        confirmSiteAddressWasRejectedBecause('Enter a real postcode');
        break;
      default:
        throw new Error('Reason ' + reason + ' not found');
    }
  },
);

Then('the user is informed that {string}', (reason) => {
  switch (reason) {
    case 'Address Line 1 is required':
      confirmSiteAddressWasRejectedBecause('Enter the first line of the address');
      break;
    case 'Address Line 1 has a limit of 60 characters':
      confirmSiteAddressWasRejectedBecause(
        'The first line of the address must be 60 characters or fewer',
      );
      break;
    case 'Address Line 2 has a limit of 60 characters':
      confirmSiteAddressWasRejectedBecause(
        'The second line of the address must be 60 characters or fewer',
      );
      break;
    case 'Town or City has a limit of 60 characters':
      confirmSiteAddressWasRejectedBecause('Town or City must be 60 characters or fewer');
      break;
    case 'County has a limit of 60 characters':
      confirmSiteAddressWasRejectedBecause('County must be 60 characters or fewer');
      break;
    case 'Postcode is required':
      confirmSiteAddressWasRejectedBecause('Enter a real postcode');
      break;
    case 'Postcode has a limit of 8 characters':
      confirmSiteAddressWasRejectedBecause('Postcode must be 8 characters or fewer');
      break;
    default:
      throw new Error('Reason ' + reason + ' not found');
  }
});

Then(
  'the user can see that their appeal has been updated with the provided site address as {string} and {string} and {string} and {string} and {string}',
  (addressLine1, addressLine2, townCity, county, postcode) => {
    confirmSiteAddressValue(addressLine1, addressLine2, townCity, county, postcode);
  },
);

Then('the user can see that their appeal has not been updated with the provided address', () => {
  confirmSiteAddressValue('', '', '', '', '');
});
