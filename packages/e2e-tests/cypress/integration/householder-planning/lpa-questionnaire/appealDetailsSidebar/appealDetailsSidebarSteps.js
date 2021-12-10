import { Given, Then } from 'cypress-cucumber-preprocessor/steps';
import { goToPage } from '../../../../support/common/go-to-page/goToPage';
import {
  getAppealDetailsSidebar
} from '../../../../support/householder-planning/lpa-questionnaire/PageObjects/AppealDetailsPageObjects';
import { verifyAppealDetailsSidebar } from '../../../../support/common/verifyAppealDetailsSidebar';

Given('A subsection page is presented', () => {
  goToPage('other-appeals');
});

Then(
  'The appeal details sidebar is displayed with the correct information',
  () => {
    getAppealDetailsSidebar().then((text) => {
      expect(text).to.contain('Planning application number');
      expect(text).to.contain('Site address');
      expect(text).to.contain('Appellant Name');
    });

    cy.get('@appeal').then((appeal) => {
      const address = Object.values(appeal.appealSiteSection.siteAddress).filter((value) => !!value);

      verifyAppealDetailsSidebar({
        applicationNumber: appeal.requiredDocumentsSection.applicationNumber,
        applicationAddress: address.join(', '),
        apellantName: appeal.aboutYouSection.yourDetails.name,
      });
    });
  },
);
