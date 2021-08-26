import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const CONCERNS = "There's no roof and only one wall.";

Given('the status of the appeal section is displayed', () => {
  cy.goToTaskListPage();
});

Given(
  'the status of the appeal section is displayed with no health and safety issues previously reported',
  () => {
    cy.goToHealthAndSafetyPage();
    cy.answerSiteHasNoIssues();
    cy.isSafetyIssuesInputPresented(false);
    cy.clickSaveAndContinue();
    cy.goToTaskListPage();
  },
);

Given('health and safety issues along with concerns have been indicated', () => {
  cy.goToHealthAndSafetyPage();
  cy.answerSiteHasIssues();
  cy.provideSafetyIssuesConcerns(CONCERNS);
});

Given('no health and safety concerns have been indicated', () => {
  cy.goToHealthAndSafetyPage();
  cy.answerSiteHasNoIssues();
});

Given(
  'the status of the appeal section is displayed with some health and safety issues previously reported',
  () => {
    cy.goToHealthAndSafetyPage();
    cy.answerSiteHasIssues();
    cy.isSafetyIssuesInputPresented(true);
    cy.provideSafetyIssuesConcerns(CONCERNS);
    cy.clickSaveAndContinue();
    cy.goToTaskListPage();
  },
);

Given('health and safety issues along with concerns have been provided', () => {
  cy.goToHealthAndSafetyPage();
  cy.answerSiteHasIssues();
  cy.isSafetyIssuesInputPresented(true);
  cy.provideSafetyIssuesConcerns(CONCERNS);
  cy.clickSaveAndContinue();
  cy.goToHealthAndSafetyPage();
});

Given(
  'health and safety issues and concerns previously indicated followed by an indication of no issues',
  () => {
    cy.goToHealthAndSafetyPage();
    cy.answerSiteHasIssues();
    cy.isSafetyIssuesInputPresented(true);
    cy.provideSafetyIssuesConcerns(CONCERNS);
    cy.clickSaveAndContinue();
    cy.goToHealthAndSafetyPage();
    cy.answerSiteHasNoIssues();
  },
);

Given('confirmation of health and safety issues is requested', () => {
  cy.goToHealthAndSafetyPage();
});

When('health and safety issues is accessed', () => {
  cy.goToHealthAndSafetyPage();
});

When('no confirmation of health and safety issues is provided', () => {
  cy.clickSaveAndContinue();
});

When('confirmation of health and safety issues is provided along with concerns', () => {
  cy.answerSiteHasIssues();
  cy.provideSafetyIssuesConcerns(CONCERNS);
  cy.clickSaveAndContinue();
});

When('confirmation of health and safety issues is provided without concerns', () => {
  cy.answerSiteHasIssues();
  cy.clickSaveAndContinue();
});

When('confirmation of no health and safety issues is provided', () => {
  cy.answerSiteHasNoIssues();
  cy.clickSaveAndContinue();
});

When(
  'confirmation of health and safety issues is provided along with concerns exceeding the limit',
  () => {
    const tooMuchIssues = 'x'.repeat(256);
    cy.answerSiteHasIssues();
    cy.provideSafetyIssuesConcerns(tooMuchIssues);
    cy.clickSaveAndContinue();
  },
);

When('health and safety issues are indicated', () => {
  cy.answerSiteHasIssues();
});

Then('the opportunity to provide health and safety issues is presented', () => {
  cy.confirmHealthAndSafetyPage();
  cy.confirmSiteHasIssuesAnswered('blank');
});

Then('health and safety issues along with concerns is presented', () => {
  cy.confirmSiteHasIssuesAnswered('yes');
  cy.isSafetyIssuesInputPresented(true);
});

Then('no health and safety issues is presented', () => {
  cy.confirmSiteHasIssuesAnswered('no');
  cy.isSafetyIssuesInputPresented(false);
});

Then('appeal is not updated because the health and safety concerns exceed the limit', () => {
  cy.isSafetyIssuesInputPresented(true);
  cy.confirmSiteSafetyRejectedBecause('Health and safety information must be 255 characters or fewer');
  cy.confirmSiteHasIssuesAnswered('blank');
});

Then(
  'appeal is updated with health and safety issues and concerns and the appeal tasks are presented',
  () => {
    cy.goToHealthAndSafetyPage();
    cy.confirmSiteHasIssuesAnswered('yes');
    cy.confirmSafetyIssuesConcernsValue(CONCERNS);
    cy.goToTaskListPage();
  },
);

Then(
  'appeal is updated with no health and safety issues and the appeal tasks are presented',
  () => {
    cy.goToHealthAndSafetyPage();
    cy.confirmSiteHasIssuesAnswered('no');
    cy.confirmSafetyIssuesConcernsValue('');
    cy.goToTaskListPage();
  },
);

Then('health and safety issues along with concerns are presented', () => {
  cy.confirmSafetyIssuesConcernsValue(CONCERNS);
});

Then('appeal is not updated because confirmation of health and safety issues is required', () => {
  cy.confirmSiteSafetyRejectedBecause(
    'Select yes if there are any health and safety issues',
  );
  cy.confirmSiteHasIssuesAnswered('blank');
});

Then('appeal is not updated because health and safety concerns are required', () => {
  cy.confirmSiteSafetyRejectedBecause('Tell us about the health and safety issues');
  cy.confirmSiteHasIssuesAnswered('blank');
});
