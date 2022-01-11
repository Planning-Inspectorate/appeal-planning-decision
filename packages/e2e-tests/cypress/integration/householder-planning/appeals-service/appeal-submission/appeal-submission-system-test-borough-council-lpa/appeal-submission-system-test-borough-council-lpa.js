import { Given } from 'cypress-cucumber-preprocessor/steps';

import '../../../common/householder-planning/appeals-service/appeal-submission-confirmation';

import '../appellant-confirms-declaration/appellant-confirms-declaration';
import { provideCompleteAppeal } from '../../../../support/householder-planning/appeals-service/appellant-submission-check-your-answers/provideCompleteAppeal';
import { clickCheckYourAnswers } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickCheckYourAnswers';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { STANDARD_APPEAL } from '../../../common/householder-planning/appeals-service/standard-appeal';

Given('an appeal is ready to be submitted with System Test Borough Council LPA', () => {
 provideCompleteAppeal(STANDARD_APPEAL, {
    chosenLocalPlanningDepartment: 'System Test Borough Council',
  });
  clickCheckYourAnswers();

  // /appellant-submission/check-answers
  clickSaveAndContinue();
});

