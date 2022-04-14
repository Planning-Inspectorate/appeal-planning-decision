import { Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import { STANDARD_APPEAL } from '../../../../common/householder-planning/appeals-service/standard-appeal';
import '../../../../common/householder-planning/appeals-service/appeal-submission-confirmation';
import '../../appellant-confirms-declaration/appellant-confirms-declaration';
import { provideCompleteAppeal } from '../../../../../support/householder-planning/appeals-service/appellant-submission-check-your-answers/provideCompleteAppeal';
import { clickCheckYourAnswers } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickCheckYourAnswers';
import { clickSaveAndContinue } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { agreeToTheDeclaration } from '../../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/agreeToTheDeclaration';
import { confirmAppealSubmitted } from '../../../../../support/householder-planning/appeals-service/appellant-confirms-declaration/confirmAppealSubmitted';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';
import {getLocalPlanningDepart} from "../../../../../support/eligibility/page-objects/local-planning-department-po";
import {getSaveAndContinueButton} from "../../../../../support/common-page-objects/common-po";
import {
  selectPlanningApplicationType
} from "../../../../../support/eligibility/planning-application-type/select-planning-application-type";

Given('an appellant has successfully submitted an appeal', () => {
  provideCompleteAppeal({
    ...STANDARD_APPEAL,
    aboutYouSection: {
      yourDetails: {
        isOriginalApplicant: true,
        name: 'Applicant Name',
        email: 'valid@email.com',
        appealingOnBehalfOf: '',
      },
    },
  });
  clickCheckYourAnswers();
  clickSaveAndContinue();
  agreeToTheDeclaration();
  confirmAppealSubmitted();
});

When('the appellant starts a new appeal', () => {
  goToAppealsPage('before-you-start/local-planning-depart');
});

Then('the appellant is able to create a new appeal without any error message', () => {
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
  selectPlanningApplicationType('Householder');
  getSaveAndContinueButton().click();
});


Given('an agent has successfully submitted an appeal', () => {
  provideCompleteAppeal({
    ...STANDARD_APPEAL,
    aboutYouSection: {
      yourDetails: {
        isOriginalApplicant: false,
        name: 'Agent Name',
        email: 'valid@email.com',
        appealingOnBehalfOf: 'Appellant Name',
      },
    },
  });
  clickCheckYourAnswers();
  clickSaveAndContinue();
  agreeToTheDeclaration();
  confirmAppealSubmitted();
});

When('the agent starts a new appeal', () => {
  goToAppealsPage('before-you-start/local-planning-depart');
});

Then('the agent is able to create a new appeal without any error message', () => {
  getLocalPlanningDepart().select('System Test Borough Council');
  getSaveAndContinueButton().click();
  selectPlanningApplicationType('Householder');
  getSaveAndContinueButton().click();
});
