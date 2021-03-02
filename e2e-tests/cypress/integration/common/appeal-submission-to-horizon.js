import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

Given('a prospective appellant has provided appeal information where the whole site can be seen', () => {
  cy.provideCompleteAppeal();
  cy.goToAccessSitePage();
  cy.answerCanSeeTheWholeAppeal();
  cy.clickSaveAndContinue();
  cy.goToTaskListPage();
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
});

Given('a prospective appellant has provided appeal information where the whole site cannot be seen', () => {
  cy.provideCompleteAppeal();
  cy.goToAccessSitePage();
  cy.answerCannotSeeTheWholeAppeal();
  cy.clickSaveAndContinue();
  cy.provideMoreDetails('Restricted access');
  cy.clickSaveAndContinue();
  cy.clickSaveAndContinue();
  cy.goToTaskListPage();
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
});

Given('a prospective appellant has provided appeal information where they own the whole site', () => {
  cy.provideCompleteAppeal();
  cy.goToWholeSiteOwnerPage();
  cy.answerOwnsTheWholeAppeal();
  cy.clickSaveAndContinue();
  cy.goToTaskListPage();
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
});

Given('a prospective appellant has provided appeal information where they do not own the whole site while confirming owner has been informed', () => {
  cy.provideCompleteAppeal();
  cy.goToWholeSiteOwnerPage();
  cy.answerDoesNotOwnTheWholeAppeal();
  cy.clickSaveAndContinue();
  cy.answerDidToldOtherOwnersAppeal();
  cy.clickSaveAndContinue();
  cy.goToTaskListPage();
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
});

Given('a prospective appellant has provided appeal information where they do not own the whole site while confirming owner has not been informed', () => {
  cy.provideCompleteAppeal();
  cy.goToWholeSiteOwnerPage();
  cy.answerDoesNotOwnTheWholeAppeal();
  cy.clickSaveAndContinue();
  cy.answerDidNotToldOtherOwnersAppeal();
  cy.clickSaveAndContinue();
  cy.goToTaskListPage();
  cy.clickCheckYourAnswers();
  cy.clickSaveAndContinue();
});

When('the appeal is submitted', () => {
  cy.confirmNavigationTermsAndConditionsPage();
  cy.task('listenToQueue');
  cy.agreeToTheDeclaration();
  cy.confirmAppealSubmitted();
});

Then('a case is created for a case officer where an inspector does not require site access', () => {
  cy.task('getLastFromQueue').then((actualMessage) => {
    const expected = require('../../fixtures/expected-appeal-where-an-inspector-does-not-require-site-access.json');
    const expectedNoDynamicFields = removeDynamicFields(expected)
    const actualNoDynamicFields = removeDynamicFields(actualMessage);
    expect(JSON.stringify(actualNoDynamicFields)).to.equal(JSON.stringify(expectedNoDynamicFields));
  });
});

Then('a case is created for a case officer where an inspector requires site access', () => {
  cy.task('getLastFromQueue').then((actualMessage) => {
    const expected = require('../../fixtures/expected-appeal-where-an-inspector-does-require-site-access.json');
    const expectedNoDynamicFields = removeDynamicFields(expected)
    const actualNoDynamicFields = removeDynamicFields(actualMessage);
    expect(JSON.stringify(actualNoDynamicFields)).to.equal(JSON.stringify(expectedNoDynamicFields));
  });
});

Then('a case is created for a case officer with Certificate A', () => {
  cy.task('getLastFromQueue').then((actualMessage) => {
    const expected = require('../../fixtures/expected-appeal-with-certificate-a.json');
    const expectedNoDynamicFields = removeDynamicFields(expected)
    const actualNoDynamicFields = removeDynamicFields(actualMessage);
    expect(JSON.stringify(actualNoDynamicFields)).to.equal(JSON.stringify(expectedNoDynamicFields));
  });
});

Then('a case without Certificate A is created for a case officer while recording that owner has been informed', () => {
  cy.task('getLastFromQueue').then((actualMessage) => {
    const expected = require('../../fixtures/expected-appeal-without-certificate-a-other-owner-informed.json');
    const expectedNoDynamicFields = removeDynamicFields(expected)
    const actualNoDynamicFields = removeDynamicFields(actualMessage);
    expect(JSON.stringify(actualNoDynamicFields)).to.equal(JSON.stringify(expectedNoDynamicFields));
  });
});

Then('a case without Certificate A is created for a case officer while recording that owner has not been informed', () => {
  cy.task('getLastFromQueue').then((actualMessage) => {
    const expected = require('../../fixtures/expected-appeal-without-certificate-a-other-owner-not-informed.json');
    const expectedNoDynamicFields = removeDynamicFields(expected)
    const actualNoDynamicFields = removeDynamicFields(actualMessage);
    expect(JSON.stringify(actualNoDynamicFields)).to.equal(JSON.stringify(expectedNoDynamicFields));
  });
});

function removeDynamicFields(obj) {
  const result = { ...obj };
  delete result._id;
  delete result.uuid;
  delete result.appeal.createdAt;
  delete result.appeal.updatedAt;
  delete result.appeal.id;
  delete result.appeal.decisionDate;
  delete result.appeal.yourAppealSection.appealStatement.uploadedFile.id;
  delete result.appeal.yourAppealSection.appealStatement.uploadedFile.location;
  delete result.appeal.requiredDocumentsSection.originalApplication.uploadedFile.id;
  delete result.appeal.requiredDocumentsSection.originalApplication.uploadedFile.location;
  delete result.appeal.requiredDocumentsSection.decisionLetter.uploadedFile.id;
  delete result.appeal.requiredDocumentsSection.decisionLetter.uploadedFile.location;
  return result;
}

