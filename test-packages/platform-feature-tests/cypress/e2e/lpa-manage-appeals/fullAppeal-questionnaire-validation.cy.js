/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../page-objects/base-page";
//import { houseHolderQuestionnaireTestCases } from "../../helpers/lpaManageAppeals/houseHolderQuestionnaireData";

const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('LPA Manage Your Appeals', () => {
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
        cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear();
        cy.getByData(yourAppealsSelector?._selectors?.emailAddress).type(lpaManageAppealsData?.emailAddress);
        cy.advanceToNextPage();
        cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaManageAppealsData?.emailCode);
        cy.advanceToNextPage();
      }
    });
  })

  it(`LPA Manage Your Appeals`, () => {
    cy.validateURL(`${Cypress.config('appeals_beta_base_url')}/manage-appeals/your-appeals`);
  });

  it(`Add and Remove user link validation`, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });

  it(`Your Appeals tab`, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });
  it(`Appeal Id Hyperlink`, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });

  it(`Questionnaire Hyperlink `, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });


  it(`Waiting for review tab`, () => {
    cy.containsMessage(basePage?._selectors.govukLink, lpaManageAppealsData?.addAndRemoveUsers);
  });


});

describe('Full appleal questionnaire validation', () => {
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
        cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear();
        cy.getByData(yourAppealsSelector?._selectors?.emailAddress).type(lpaManageAppealsData?.emailAddress);
        cy.advanceToNextPage();
        cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaManageAppealsData?.emailCode);
        cy.advanceToNextPage();
      }
    });
  })
  it(`Validating Full appeal questionnaire url`, () => {
    let appealId;
    let counter = 0;
    cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
      const rowtext = $row.text();		
      if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && !rowtext.includes(lpaManageAppealsData?.todoInvalid)) {
        if (counter === 0) {				
          cy.wrap($row).within(() => {
            cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');					
            cy.get('a').each(($link) => {
              if ($link.attr('href')?.includes(lpaManageAppealsData?.todoQuestionnaire)) {
                appealId = $link.attr('href')?.split('/').pop();
                cy.log(appealId);							
                cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
                return false;
              }
            });
          });
        }
        counter++;
      }
    }).then(() => {

      cy.url().should('include', `/manage-appeals/questionnaire/${appealId}`);

    });
  });

  it(`Validating Full appeal questionnaire url`, () => {
    let appealId;
    let counter = 0;
    cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
      const rowtext = $row.text();		
      if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && !rowtext.includes(lpaManageAppealsData?.todoInvalid)) {
        if (counter === 0) {				
          cy.wrap($row).within(() => {
            cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');					
            cy.get('a').each(($link) => {
              if ($link.attr('href')?.includes(lpaManageAppealsData?.todoQuestionnaire)) {
                appealId = $link.attr('href')?.split('/').pop();
                cy.log(appealId);							
                cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
                return false;
              }
            });
          });
        }
        counter++;
      }
    }).then(() => {

      cy.url().should('include', `/manage-appeals/questionnaire/${appealId}`);

    });
  });
});

