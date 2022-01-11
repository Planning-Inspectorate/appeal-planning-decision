import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToAppealsPage, } from '../../../../../support/common/go-to-page/goToAppealsPage';
import { userIsNavigatedToPage } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/userIsNavigatedToPage';
import { verifyPageTitle } from '../../../../../support/common/verify-page-title';
import { verifyPageHeading } from '../../../../../support/common/verify-page-heading';
import { pageURLAppeal } from '../../../../common/householder-planning/appeals-service/pageURLAppeal';


const heading = 'Appeal a householder planning decision';
const title = 'Before you appeal - Appeal a householder planning decision - GOV.UK';
//const  url = 'before-you-appeal';
const  url = 'http://localhost:9003/before-you-appeal';
let disableJs = false;
//
// const goToBeforeYouAppealPage = () => {
//   goToPage(url, undefined, disableJs);
// };


Given('the appellant is on the before you appeal page', () => {
   goToAppealsPage(pageURLAppeal.goToPageBeforeYouAppeal);
  //goToBeforeYouAppealPage();
 // verifyPage(url);
  verifyPageTitle(title);
  verifyPageHeading('Appeal a householder planning decision');
  // checkPageA11();
});

Then('information about when you can appeal is provided', () => {
  userIsNavigatedToPage('/when-you-can-appeal');
});
