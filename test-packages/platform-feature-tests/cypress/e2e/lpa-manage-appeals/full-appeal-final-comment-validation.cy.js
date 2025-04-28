
/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>
import { fullAppealFinalCommentTestCases } from "../../helpers/lpaManageAppeals/fullAppealFinalCommentData";
import { BasePage } from "../../page-objects/base-page";
const { fullAppealFinalComment } = require('../../support/flows/sections/lpaManageAppeals/fullAppealFinalComment');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('Full Planning Final comment Test Cases', () => {
        const yourAppealsSelector = new YourAppealsSelector();
        const basePage = new BasePage();
        let lpaManageAppealsData;
        let appealId;

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
                let counter = 0;
                cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
                        // cy.log($row);
                        const rowtext = $row.text();
                        if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && rowtext.includes(lpaManageAppealsData?.todoFinalcomment)) {
                                cy.log(lpaManageAppealsData?.s78AppealType);
                                if (counter === 0) {
                                        cy.log(rowtext);
                                        cy.wrap($row).within(() => {
                                                cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');
                                                cy.get('a').each(($link) => {
                                                        if ($link.attr('href')?.includes('final-comments')) {
                                                                cy.log(lpaManageAppealsData?.todoFinalcomment);
                                                                const parts = $link.attr('href')?.split('/');
                                                                appealId = parts?.[parts.length - 2];
                                                                cy.log(appealId);
                                                                cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
                                                                return false;
                                                        }
                                                });
                                        });
                                }
                                counter++;
                        }
                });
        })

        // it(`Final Comment url`, () => {
        //         cy.url().should('include', `/manage-appeals/final-comments/${appealId}/submit-final-comments`);
        // });
        // it(`Validate to submit any Final comments error validation`, () => {
        //         cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
        //         cy.get('input[name="lpaFinalComment"]:checked').then(($checked) => {
        //                 if ($checked.length > 0) {
        //                         cy.log("Radio Button already selected");
        //                         return;
        //                 }
        //                 else {
        //                         cy.advanceToNextPage();
        //                         cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#lpaFinalComment').and('contain.text', 'Select yes if you want to submit any final comments');
        //                 }
        //         })
        // });

        // it(`Validate sensitive information text`, () => {
        //         cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
        //         cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
        //         cy.advanceToNextPage();
        //         cy.get('#lpaFinalCommentDetails').clear();
        //         cy.advanceToNextPage();
        //         cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Enter your final comments');
        // });
        // it(`Validate sensitive information check box`, () => {
        //         cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
        //         cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
        //         cy.advanceToNextPage();
        //         cy.get('#lpaFinalCommentDetails').clear();
        //         cy.get('#lpaFinalCommentDetails').type("Final comment test");
        //         cy.advanceToNextPage();
        //         cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'You must confirm that you have not included any sensitive information in your final comments');
        // });
        it(`Validate additional documents validation`, () => {
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.get('#lpaFinalCommentDetails').clear();
                cy.get('#lpaFinalCommentDetails').type("Final comment test");
                cy.get('#sensitiveInformationCheckbox').check({ force: true });
                cy.advanceToNextPage();
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you have additional documents to support your final comments?');
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();                
                // Added below to test remove exisiting uploaded file to test error message
                const expectedFileNames = ["press-advertisement.pdf","site-notice.pdf"];
                expectedFileNames.forEach((fileName) => {
                    cy.uploadFileFromFixtureDirectory(fileName);
                });
                 // eslint-disable-next-line cypress/no-unnecessary-waiting
                 cy.wait(10000);
                expectedFileNames.forEach((fileName, index) => {
                    cy.get('.moj-multi-file-upload__filename')
                        .eq(index)
                        .should('contain.text', fileName);
                });               
                expectedFileNames.forEach((filename,index) => {
                    cy.get('.moj-multi-file-upload__delete')
                        .eq(expectedFileNames.length-1-index)
                        .click()
                })

                // eslint-disable-next-line cypress/no-unnecessary-waiting
                cy.wait(10000);
              //  cy.reload(true);

                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select your new supporting documents');
        });
});