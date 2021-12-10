import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
import { verifyPage } from '../../../../support/common/verifyPage';
import { verifyPageTitle } from '../../../../support/common/verify-page-title';
import { visibleWithText } from '../../../../support/common/visibleWithText';

const informationSubmittedUrl = 'information-submitted';
const informationSubmittedPageTitle =
  'Information submitted - Appeal questionnaire - Appeal a householder planning decision - GOV.UK';

Given(`the Information Submitted page is requested`, () => {
  goToPage(informationSubmittedUrl);
});

Then(`the Information Submitted page will be shown`, () => {
  verifyPage(informationSubmittedUrl);
  verifyPageTitle(informationSubmittedPageTitle);
});

Then(`the LPA email address is displayed on the Information Submitted page`, () => {
  visibleWithText(
    `We’ve sent a confirmation email to AppealPlanningDecisionTest@planninginspectorate.gov.uk.`,
    '[data-cy=lpaEmailString]',
  );
});
