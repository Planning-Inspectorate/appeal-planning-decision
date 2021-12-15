import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { verifyAppealDetailsSidebar } from '../../../../support/common/verifyAppealDetailsSidebar';
import { goToLPAPage } from '../../../../support/common/go-to-page/goToLPAPage';
import { getAppealDetailsSidebar } from '../../../../support/common-page-objects/common-po';

Given('A subsection page is presented', () => {
  goToLPAPage('other-appeals');
});
