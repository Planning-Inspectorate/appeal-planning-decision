import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { answerCanSeeTheWholeAppeal } from '../../../../../support/householder-planning/appeals-service/appeal-submission-access-to-appeal-site/answerCanSeeTheWholeAppeal';
import { clickSaveAndContinue } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { answerCannotSeeTheWholeAppeal } from '../../../../../support/householder-planning/appeals-service/appeal-submission-access-to-appeal-site/answerCannotSeeTheWholeAppeal';
import { provideMoreDetails } from '../../../../../support/householder-planning/appeals-service/appeal-submission-access-to-appeal-site/provideMoreDetails';
import { confirmAccessSiteAnswered } from '../../../../../support/householder-planning/appeals-service/appeal-submission-access-to-appeal-site/confirmAccessSiteAnswered';
import { confirmAccessSiteNotSubmitted } from '../../../../../support/householder-planning/appeals-service/appeal-submission-access-to-appeal-site/confirmAccessSiteNotSubmitted';
import { confirmAccessSiteWasRejectedBecause } from '../../../../../support/householder-planning/appeals-service/appeal-submission-access-to-appeal-site/confirmAccessSiteWasRejectedBecause';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
const url = 'appellant-submission/site-access';
Given('the user is prompted to provide access to the inspector visiting the appeal site', () => {
  goToAppealsPage(url);
});

When('the user does not select any option', () => {});

When('the user selects {string} to provide access', (answer) => {
  if (answer === 'Yes') {
    answerCanSeeTheWholeAppeal();
    clickSaveAndContinue();
  } else {
    answerCannotSeeTheWholeAppeal();
  }
});

When(
  'the user does provide additional information with character length exceeding the limit',
  () => {
    provideMoreDetails('word'.repeat(64));
  },
);

When('the user {string} provide additional information', (provided) => {
  if (provided === 'does') {
    provideMoreDetails('More information');
  }
  clickSaveAndContinue();
});

Then('the user can see the selected option {string} submitted', (submitted) => {
  if (submitted.includes('Yes')) {
    confirmAccessSiteAnswered('yes');
  } else if (submitted.includes('No')) {
    confirmAccessSiteAnswered('no', 'More information');
  } else {
    throw new Error('unknown selected option');
  }
});

Then('the user can see that there is no option submitted', () => {
  confirmAccessSiteNotSubmitted();
});

Then('the user is informed that {string}', (reason) => {
  switch (reason) {
    case 'further information is required to gain access to the restricted site':
      confirmAccessSiteWasRejectedBecause('Tell us how access is restricted');
      break;
    default:
      throw new Error('The reason "' + reason + '" is unknown');
  }
});

Then('the user is told {string}', (reason) => {
  confirmAccessSiteWasRejectedBecause(reason);
});
