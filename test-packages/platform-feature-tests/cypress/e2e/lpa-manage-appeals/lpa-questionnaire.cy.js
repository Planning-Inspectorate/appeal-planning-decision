import { BasePage } from "../../page-objects/base-page";

const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('LPA Manage Appeals Questionnaire', () => {
  const basePage = new BasePage();
  const yourAppealsSelector = new YourAppealsSelector();
  let lpaQuestionnaireData;
  beforeEach(() => {
    cy.fixture('lpaQuestionnaireData').then(data => {
      lpaQuestionnaireData = data;
    })
    cy.visit(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`);
    cy.url().then((url) => {
      if (url.includes('/manage-appeals/your-email-address')) {
        cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear().type(lpaQuestionnaireData?.emailAddress);
        cy.advanceToNextPage();
        cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaQuestionnaireData?.emailCode);
        cy.advanceToNextPage();
      }
    });
  })

  it(`LPA Manage Appeals Questionnaire`, () => {
    cy.validateURL(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-appeals`);
  });

  it(`Add and Remove user link validation`, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaQuestionnaireData?.addAndRemoveUsers);
  });
});