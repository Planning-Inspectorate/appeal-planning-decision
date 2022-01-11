import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import moment from 'moment';
import * as accordionState from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/accordionState';
import {
  allAccordionSections,
  getSelectorByString,
} from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/selectors';
import AGENT_APPEAL_WITHOUT_FILES from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/to-replace-with-api-calls/agent-appeal-without-files';
import APPELLANT_APPEAL_WITH_FILES from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/to-replace-with-api-calls/appellant-appeal-with-files';
import { createAgentAppealWithoutFiles } from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/to-replace-with-api-calls/createAgentAppealWithoutFiles';
import { createAppellantAppealWithoutFiles } from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/to-replace-with-api-calls/createAppellantAppealWithoutFiles';
import { assertYourAppealDetailsAccordionPanelStatus } from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/assertYourAppealDetailsAccordionPanelStatus';
import { toggleAllYourAppealDetailsAccordionPanels } from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/toggleAllYourAppealDetailsAccordionPanels';
import { appellantViewsYourAppealDetailsInvalid } from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/appellantViewsYourAppealDetailsInvalid';
import { clearSession } from '../../../../../support/common/clearSession';
import { createAppellantAppealWithFiles } from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/to-replace-with-api-calls/createAppellantAppealWithFiles';
import { createAgentAppealWithFiles } from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/to-replace-with-api-calls/createAgentAppealWithFiles';
import { toggleIndividualYourAppealDetailsAccordionPanel } from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/toggleIndividualYourAppealDetailsAccordionPanel';
import { clickBackLink } from '../../../../../support/householder-planning/appeals-service/back-link/clickBackLink';
import { assertIs400ErrorPage } from '../../../../../support/common/assertIs400ErrorPage';
import { assertIsYourPlanningAppealPage } from '../../../../../support/householder-planning/appeals-service/your-planning-appeal/assertIsYourPlanningAppealPage';
import { assertHasLinkToViewYourAppealDetails } from '../../../../../support/householder-planning/appeals-service/your-planning-appeal-your-appeal-details/assertHasLinkToViewYourAppealDetails';
import { assertCyTagHasExactText } from '../../../../../support/common/assertCyTagHasExactText';
import { assertMultifileUploadDisplay } from '../../../../../support/common/assertMultifileUploadDisplay';
import { STANDARD_APPEAL } from '../../../../common/householder-planning/appeals-service/standard-appeal';
import { goToAppealsPage } from '../../../../../support/common/go-to-page/goToAppealsPage';


beforeEach(() => {
  clearSession();
});

Given('an appellant has submitted an appeal', () => {
  createAppellantAppealWithoutFiles();

  cy.get('@appellantAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
  });
});

Given('an agent has submitted an appeal', () => {
  createAgentAppealWithoutFiles();

  cy.get('@agentAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
  });
});

Given('an appellant is viewing a valid appeal with JavaScript enabled', () => {
  createAppellantAppealWithoutFiles();

  cy.get('@appellantAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();
  });
});

Given('an agent is viewing a valid appeal with JavaScript enabled', () => {
  createAgentAppealWithoutFiles();

  cy.get('@agentAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();
  });
});

Given('an appellant is viewing a valid appeal', () => {
  createAppellantAppealWithoutFiles();

  cy.get('@appellantAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();
  });
});

Given('an agent is viewing a valid appeal', () => {
  createAgentAppealWithoutFiles();

  cy.get('@agentAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();
  });
});

Given('an appellant is viewing the appeal details with Javascript disabled', () => {
  createAppellantAppealWithoutFiles();

  cy.get('@appellantAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`, { script: false });
    cy.get('[data-cy="view-your-appeal-details-link"]').click();
  });
});

Given('an agent is viewing the appeal details with Javascript disabled', () => {
  createAgentAppealWithoutFiles();

  cy.get('@agentAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`, { script: false });
    cy.get('[data-cy="view-your-appeal-details-link"]').click();
  });
});

Given('an appellant is viewing a valid appeal with all sections closed', () => {
  createAppellantAppealWithoutFiles();

  cy.get('@appellantAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();

    assertYourAppealDetailsAccordionPanelStatus({
      sectionsUnderTest: allAccordionSections,
      expectedState: accordionState.CLOSED,
    });
  });
});

Given('an agent is viewing a valid appeal with all sections closed', () => {
  createAgentAppealWithoutFiles();

  cy.get('@agentAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();

    assertYourAppealDetailsAccordionPanelStatus({
      sectionsUnderTest: allAccordionSections,
      expectedState: accordionState.CLOSED,
    });
  });
});

Given('an appellant is viewing a valid appeal with all sections open', () => {
  createAppellantAppealWithoutFiles();

  cy.get('@appellantAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();

    assertYourAppealDetailsAccordionPanelStatus({
      sectionsUnderTest: allAccordionSections,
      expectedState: accordionState.CLOSED,
    });
    toggleAllYourAppealDetailsAccordionPanels({ expectedEndState: accordionState.OPEN });
    assertYourAppealDetailsAccordionPanelStatus({
      sectionsUnderTest: allAccordionSections,
      expectedState: accordionState.OPEN,
    });
  });
});

Given('an agent is viewing a valid appeal with all sections open', () => {
  createAgentAppealWithoutFiles();

  cy.get('@agentAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();

    assertYourAppealDetailsAccordionPanelStatus({
      sectionsUnderTest: allAccordionSections,
      expectedState: accordionState.CLOSED,
    });
    toggleAllYourAppealDetailsAccordionPanels({ expectedEndState: accordionState.OPEN });
    assertYourAppealDetailsAccordionPanelStatus({
      sectionsUnderTest: allAccordionSections,
      expectedState: accordionState.OPEN,
    });
  });
});

Given('an appellant is viewing a valid appeal where at least one section is closed', () => {
  createAppellantAppealWithoutFiles();

  cy.get('@appellantAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();

    assertYourAppealDetailsAccordionPanelStatus({
      sectionsUnderTest: allAccordionSections,
      expectedState: accordionState.CLOSED,
    });
  });
});

Given('an agent is viewing a valid appeal where at least one section is closed', () => {
  createAgentAppealWithoutFiles();

  cy.get('@agentAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();

    assertYourAppealDetailsAccordionPanelStatus({
      sectionsUnderTest: allAccordionSections,
      expectedState: accordionState.CLOSED,
    });
  });
});

Given('an appellant is viewing an appeal where at least one section is open', () => {
  createAppellantAppealWithoutFiles();

  cy.get('@appellantAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();

    toggleAllYourAppealDetailsAccordionPanels({ expectedEndState: accordionState.OPEN });
  });
});

Given('an agent is viewing an appeal where at least one section is open', () => {
  createAgentAppealWithoutFiles();

  cy.get('@agentAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();

    toggleAllYourAppealDetailsAccordionPanels({ expectedEndState: accordionState.OPEN });
  });
});

Given('an appellant or agent is viewing the appeal details for an invalid appeal ID', () => {
  clearSession();
  appellantViewsYourAppealDetailsInvalid({ failOnStatusCode: false });
});

Given(`an appellant is on the 'Your planning appeal' page`, () => {
  createAppellantAppealWithoutFiles();

  cy.get('@appellantAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
  });
});

Given(`an agent is on the 'Your planning appeal' page`, () => {
 createAgentAppealWithoutFiles();

  cy.get('@agentAppealWithoutFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
  });
});
Given('an appellant has submitted an appeal that includes multiple documents', () => {
  createAppellantAppealWithFiles();

  cy.get('@appellantAppealWithFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();
  });
});

Given('an agent has submitted an appeal that includes multiple documents', () => {
 createAgentAppealWithFiles();

  cy.get('@agentAppealWithFilesAppealId').then((appealId) => {
    goToAppealsPage(`your-planning-appeal/${appealId}`);
    cy.get('[data-cy="view-your-appeal-details-link"]').click();
  });
});

When('they select to open all sections', () => {
  toggleAllYourAppealDetailsAccordionPanels({ expectedEndState: accordionState.OPEN });
});

When('they select to close all sections', () => {
  toggleAllYourAppealDetailsAccordionPanels({ expectedEndState: accordionState.CLOSED });
});

When('they select to open the {string} section', (sectionTitle) => {
  toggleIndividualYourAppealDetailsAccordionPanel({
    sectionTitle,
  });
});

When('they select to close the {string} section', (sectionTitle) => {
  toggleIndividualYourAppealDetailsAccordionPanel({
    sectionTitle,
  });
});

When('the appellant selects the ‘Back’ link', () => {
  clickBackLink();
});

When('the agent selects the ‘Back’ link', () => {
  clickBackLink();
});

When('the appellant is on the ‘Your planning appeal’ page', () => {
  // very brittle - hazard of current approach
  cy.get('@appellantAppealWithoutFilesAppealId').then((appealId) => {
    cy.url().should('match', new RegExp(`\/your-planning-appeal\/${appealId}$`));
  });
});

When('the agent is on the ‘Your planning appeal’ page', () => {
  // very brittle - hazard of current approach
  cy.get('@agentAppealWithoutFilesAppealId').then((appealId) => {
    cy.url().should('match', new RegExp(`\/your-planning-appeal\/${appealId}$`));
  });
});

When(`the appellant selects the 'View your appeal details' link`, () => {
  cy.get('[data-cy="view-your-appeal-details-link"]').click();
});

When(`the agent selects the 'View your appeal details' link`, () => {
  cy.get('[data-cy="view-your-appeal-details-link"]').click();
});

Then('all the sections are opened', () => {
  //cy.get('.govuk-accordion__open-all').click();
  assertYourAppealDetailsAccordionPanelStatus({
    sectionsUnderTest: allAccordionSections,
    expectedState: accordionState.OPEN,
  });
});

Then('all the sections are closed', () => {
  assertYourAppealDetailsAccordionPanelStatus({
    sectionsUnderTest: allAccordionSections,
    expectedState: accordionState.CLOSED,
  });
});

Then('the {string} section details are displayed', (sectionTitle) => {
  assertYourAppealDetailsAccordionPanelStatus({
    sectionsUnderTest: getSelectorByString(sectionTitle),
    expectedState: accordionState.OPEN,
  });
});

Then('the {string} section details are hidden', (sectionTitle) => {
  assertYourAppealDetailsAccordionPanelStatus({
    sectionsUnderTest: getSelectorByString(sectionTitle),
    expectedState: accordionState.CLOSED,
  });
});

Then('all the sections on the page will be closed by default', () => {
 assertYourAppealDetailsAccordionPanelStatus({
    sectionsUnderTest: allAccordionSections,
    expectedState: accordionState.CLOSED,
  });
});

Then('the 400 error page will be displayed', () => {
  assertIs400ErrorPage({
    expectedMessage: 'Sorry, we were unable to find the details for your appeal.',
  });
});

Then('the "Your planning appeal" page will be displayed for the current appeal - appellant', () => {
  // very brittle - hazard of current approach
  cy.get('@appellantAppealWithoutFilesAppealId').then((appealId) => {
    assertIsYourPlanningAppealPage({ appealId });
  });
});

Then('the "Your planning appeal" page will be displayed for the current appeal - agent', () => {
  // very brittle - hazard of current approach
  cy.get('@agentAppealWithoutFilesAppealId').then((appealId) => {
    assertIsYourPlanningAppealPage({ appealId });
  });
});

Then('the page will contain a link to ‘View your appeal details’', () => {
  assertHasLinkToViewYourAppealDetails();
});

/**
 * The following 'thens' are awful and need a strong refactor - TODO when the API setup step is available
 */
Then('the appeal details will be shown - appellant, without files', () => {
  assertCyTagHasExactText({
    'appeal-submission-date': moment().format('D MMMM YYYY'),
    'appellant-name': STANDARD_APPEAL.aboutYouSection.yourDetails.name,
    'planning-application-number': STANDARD_APPEAL.requiredDocumentsSection.applicationNumber,
    'appeal-site': [
      STANDARD_APPEAL.appealSiteSection.siteAddress.addressLine1,
      STANDARD_APPEAL.appealSiteSection.siteAddress.addressLine2,
      STANDARD_APPEAL.appealSiteSection.siteAddress.town,
      STANDARD_APPEAL.appealSiteSection.siteAddress.county,
      STANDARD_APPEAL.appealSiteSection.siteAddress.postcode,
    ].join(''),
    'local-planning-department': 'System Test Borough Council',
  });

  assertMultifileUploadDisplay('planning-application-form', [
    STANDARD_APPEAL.requiredDocumentsSection.originalApplication.uploadedFile.name,
  ]);
  assertMultifileUploadDisplay('decision-letter', [
    STANDARD_APPEAL.requiredDocumentsSection.decisionLetter.uploadedFile.name,
  ]);

  assertMultifileUploadDisplay('your-appeal-statement', [
    STANDARD_APPEAL.yourAppealSection.appealStatement.uploadedFile.name,
  ]);
  assertMultifileUploadDisplay('documents-to-support-your-appeal', []);

  assertCyTagHasExactText({
    'do-you-own-the-whole-appeal-site': STANDARD_APPEAL.appealSiteSection.siteOwnership
      .ownsWholeSite
      ? 'Yes'
      : 'No',
    'have-you-told-the-other-owners-you-are-appealling': STANDARD_APPEAL.appealSiteSection
      .siteOwnership.haveOtherOwnersBeenTold
      ? 'Yes'
      : 'No, but I understand that I have to inform them',
    'can-the-inspector-see-the-whole-appeal-site-from-a-public-road': STANDARD_APPEAL
      .appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad
      ? 'Yes'
      : STANDARD_APPEAL.appealSiteSection.siteAccess.howIsSiteAccessRestricted,
    'any-health-and-safety-issues': STANDARD_APPEAL.appealSiteSection.healthAndSafety.hasIssues
      ? STANDARD_APPEAL.appealSiteSection.healthAndSafety.healthAndSafetyIssues
      : 'No',
  });
  // cy.checkPageA11y({
  //   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  //   exclude: ['.govuk-radios__input'],
  // });
});

Then('the appeal details will be shown - agent, without files', () => {
  assertCyTagHasExactText({
    'appeal-submission-date': moment().format('D MMMM YYYY'),
    'appellant-name': AGENT_APPEAL_WITHOUT_FILES.aboutYouSection.yourDetails.appealingOnBehalfOf,
    'planning-application-number':
      AGENT_APPEAL_WITHOUT_FILES.requiredDocumentsSection.applicationNumber,
    'appeal-site': [
      AGENT_APPEAL_WITHOUT_FILES.appealSiteSection.siteAddress.addressLine1,
      AGENT_APPEAL_WITHOUT_FILES.appealSiteSection.siteAddress.addressLine2,
      AGENT_APPEAL_WITHOUT_FILES.appealSiteSection.siteAddress.town,
      AGENT_APPEAL_WITHOUT_FILES.appealSiteSection.siteAddress.county,
      AGENT_APPEAL_WITHOUT_FILES.appealSiteSection.siteAddress.postcode,
    ].join(''),
    'local-planning-department': 'System Test Borough Council',
  });

  assertMultifileUploadDisplay('planning-application-form', [
    AGENT_APPEAL_WITHOUT_FILES.requiredDocumentsSection.originalApplication.uploadedFile.name,
  ]);
  assertMultifileUploadDisplay('decision-letter', [
    AGENT_APPEAL_WITHOUT_FILES.requiredDocumentsSection.decisionLetter.uploadedFile.name,
  ]);

  assertMultifileUploadDisplay('your-appeal-statement', [
    AGENT_APPEAL_WITHOUT_FILES.yourAppealSection.appealStatement.uploadedFile.name,
  ]);
  assertMultifileUploadDisplay('documents-to-support-your-appeal', []);

  assertCyTagHasExactText({
    'do-you-own-the-whole-appeal-site': AGENT_APPEAL_WITHOUT_FILES.appealSiteSection.siteOwnership
      .ownsWholeSite
      ? 'Yes'
      : 'No',
    'have-you-told-the-other-owners-you-are-appealling': AGENT_APPEAL_WITHOUT_FILES
      .appealSiteSection.siteOwnership.haveOtherOwnersBeenTold
      ? 'Yes'
      : 'No, but I understand that I have to inform them',
    'can-the-inspector-see-the-whole-appeal-site-from-a-public-road': AGENT_APPEAL_WITHOUT_FILES
      .appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad
      ? 'Yes'
      : AGENT_APPEAL_WITHOUT_FILES.appealSiteSection.siteAccess.howIsSiteAccessRestricted,
    'any-health-and-safety-issues': AGENT_APPEAL_WITHOUT_FILES.appealSiteSection.healthAndSafety
      .hasIssues
      ? AGENT_APPEAL_WITHOUT_FILES.appealSiteSection.healthAndSafety.healthAndSafetyIssues
      : 'No',
  });
  // cy.checkPageA11y({
  //   // known issue: https://github.com/alphagov/govuk-frontend/issues/979
  //   exclude: ['.govuk-radios__input'],
  // });
});

Then('a count for each document type will be displayed on the page - appellant', () => {
  assertCyTagHasExactText({
    'appeal-submission-date': moment().format('D MMMM YYYY'),
    'appellant-name': APPELLANT_APPEAL_WITH_FILES.aboutYouSection.yourDetails.name,
    'planning-application-number':
      APPELLANT_APPEAL_WITH_FILES.requiredDocumentsSection.applicationNumber,
    'appeal-site': [
      APPELLANT_APPEAL_WITH_FILES.appealSiteSection.siteAddress.addressLine1,
      APPELLANT_APPEAL_WITH_FILES.appealSiteSection.siteAddress.addressLine2,
      APPELLANT_APPEAL_WITH_FILES.appealSiteSection.siteAddress.town,
      APPELLANT_APPEAL_WITH_FILES.appealSiteSection.siteAddress.county,
      APPELLANT_APPEAL_WITH_FILES.appealSiteSection.siteAddress.postcode,
    ].join(''),
    'local-planning-department': 'System Test Borough Council',
  });

  assertMultifileUploadDisplay('planning-application-form', [
    APPELLANT_APPEAL_WITH_FILES.requiredDocumentsSection.originalApplication.uploadedFile.name,
  ]);
  assertMultifileUploadDisplay('decision-letter', [
    APPELLANT_APPEAL_WITH_FILES.requiredDocumentsSection.decisionLetter.uploadedFile.name,
  ]);

  assertMultifileUploadDisplay('your-appeal-statement', [
    APPELLANT_APPEAL_WITH_FILES.yourAppealSection.appealStatement.uploadedFile.name,
  ]);
  assertMultifileUploadDisplay(
    'documents-to-support-your-appeal',
    APPELLANT_APPEAL_WITH_FILES.yourAppealSection.otherDocuments.uploadedFiles
      .map(({ name }) => name)
      .reverse(),
    // reversed because cypress will upload them in the order given them, then display them in the order of most recently uploaded
  );

  assertCyTagHasExactText({
    'do-you-own-the-whole-appeal-site': APPELLANT_APPEAL_WITH_FILES.appealSiteSection.siteOwnership
      .ownsWholeSite
      ? 'Yes'
      : 'No',
    'have-you-told-the-other-owners-you-are-appealling': APPELLANT_APPEAL_WITH_FILES
      .appealSiteSection.siteOwnership.haveOtherOwnersBeenTold
      ? 'Yes'
      : 'No, but I understand that I have to inform them',
    'can-the-inspector-see-the-whole-appeal-site-from-a-public-road': APPELLANT_APPEAL_WITH_FILES
      .appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad
      ? 'Yes'
      : APPELLANT_APPEAL_WITH_FILES.appealSiteSection.siteAccess.howIsSiteAccessRestricted,
    'any-health-and-safety-issues': APPELLANT_APPEAL_WITH_FILES.appealSiteSection.healthAndSafety
      .hasIssues
      ? APPELLANT_APPEAL_WITH_FILES.appealSiteSection.healthAndSafety.healthAndSafetyIssues
      : 'No',
  });
});

Then('a count for each document type will be displayed on the page - agent', () => {
  assertCyTagHasExactText({
    'appeal-submission-date': moment().format('D MMMM YYYY'),
    'appellant-name': AGENT_APPEAL_WITH_FILES.aboutYouSection.yourDetails.appealingOnBehalfOf,
    'planning-application-number':
      AGENT_APPEAL_WITH_FILES.requiredDocumentsSection.applicationNumber,
    'appeal-site': [
      AGENT_APPEAL_WITH_FILES.appealSiteSection.siteAddress.addressLine1,
      AGENT_APPEAL_WITH_FILES.appealSiteSection.siteAddress.addressLine2,
      AGENT_APPEAL_WITH_FILES.appealSiteSection.siteAddress.town,
      AGENT_APPEAL_WITH_FILES.appealSiteSection.siteAddress.county,
      AGENT_APPEAL_WITH_FILES.appealSiteSection.siteAddress.postcode,
    ].join(''),
    'local-planning-department': 'System Test Borough Council',
  });

  assertMultifileUploadDisplay('planning-application-form', [
    AGENT_APPEAL_WITH_FILES.requiredDocumentsSection.originalApplication.uploadedFile.name,
  ]);
  assertMultifileUploadDisplay('decision-letter', [
    AGENT_APPEAL_WITH_FILES.requiredDocumentsSection.decisionLetter.uploadedFile.name,
  ]);

  assertMultifileUploadDisplay('your-appeal-statement', [
    AGENT_APPEAL_WITH_FILES.yourAppealSection.appealStatement.uploadedFile.name,
  ]);
  assertMultifileUploadDisplay(
    'documents-to-support-your-appeal',
    AGENT_APPEAL_WITH_FILES.yourAppealSection.otherDocuments.uploadedFiles
      .map(({ name }) => name)
      .reverse(),
    // reversed because cypress will upload them in the order given them, then display them in the order of most recently uploaded
  );

  assertCyTagHasExactText({
    'do-you-own-the-whole-appeal-site': AGENT_APPEAL_WITH_FILES.appealSiteSection.siteOwnership
      .ownsWholeSite
      ? 'Yes'
      : 'No',
    'have-you-told-the-other-owners-you-are-appealling': AGENT_APPEAL_WITH_FILES.appealSiteSection
      .siteOwnership.haveOtherOwnersBeenTold
      ? 'Yes'
      : 'No, but I understand that I have to inform them',
    'can-the-inspector-see-the-whole-appeal-site-from-a-public-road': AGENT_APPEAL_WITH_FILES
      .appealSiteSection.siteAccess.canInspectorSeeWholeSiteFromPublicRoad
      ? 'Yes'
      : AGENT_APPEAL_WITH_FILES.appealSiteSection.siteAccess.howIsSiteAccessRestricted,
    'any-health-and-safety-issues': AGENT_APPEAL_WITH_FILES.appealSiteSection.healthAndSafety
      .hasIssues
      ? AGENT_APPEAL_WITH_FILES.appealSiteSection.healthAndSafety.healthAndSafetyIssues
      : 'No',
  });
});
// -----------------------------------------------------------------------------------

Then('the user sees the label for appellant name as {string}', (label) => {
  cy.get('[class=govuk-summary-list__key]').first().should(
    'contain',
    label,
  );
});
