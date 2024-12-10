import { BasePage } from "../../page-objects/base-page";

const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('LPA Manage Appeals Questionnaire', () => {
  const basePage = new BasePage();
  const yourAppealsSelector = new YourAppealsSelector();
  let lpaManageAppealsData;
  beforeEach(() => {
    cy.fixture('lpaManageAppealsData').then(data => {
      lpaManageAppealsData = data;
    })
    cy.visit(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-email-address`);
    cy.url().then((url) => {
      if (url.includes('/manage-appeals/your-email-address')) {
        cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear().type(lpaManageAppealsData?.emailAddress);
        cy.advanceToNextPage();
        cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaManageAppealsData?.emailCode);
        cy.advanceToNextPage();
      }
    });
  })

  it(`LPA Manage Appeals Questionnaire`, () => {
    cy.validateURL(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-appeals`);
  });

  it(`Add and Remove user link validation`, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });
});