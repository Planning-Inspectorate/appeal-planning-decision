
/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>
import { finalCommentTestCases } from "../../helpers/appellantAAPD/finalCommentData";
import { BasePage } from "../../page-objects/base-page";
import { deleteUploadedDocuments } from "../../utils/deleteUploadedDocuments";
import { users } from '../../fixtures/users.js';
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");

describe('Appellant Full Planning Final Comment Validation Test Cases', { tags: '@S78-appellant-Final-Comment-Validation' }, () => {
        const prepareAppealSelector = new PrepareAppealSelector();
        let prepareAppealData;
        const basePage = new BasePage();
        let appealId;
        before(() => {
                cy.login(users.appeals.authUser);
        });
        beforeEach(() => {
                cy.fixture('prepareAppealData').then(data => {
                        prepareAppealData = data;
                })
                cy.visit(`${Cypress.config('appeals_beta_base_url')}/appeal/email-address`);
                cy.url().then((url) => {
                        if (url.includes('/appeal/email-address')) {
                                cy.getById(prepareAppealSelector?._selectors?.emailAddress).clear();
                                cy.getById(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
                                cy.advanceToNextPage();
                                cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
                                cy.advanceToNextPage();
                        }
                });
                let counter = 0;
                cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
                        const rowtext = $row.text();
                        if (rowtext.toLowerCase().includes(prepareAppealData?.FullAppealType.toLowerCase()) && rowtext.includes(prepareAppealData?.todoFinalComments)) {
                                if (counter === 0) {
                                        cy.wrap($row).within(() => {
                                                cy.get(basePage?._selectors.trgovukTableCell).contains(prepareAppealData?.FullAppealType).should('be.visible');
                                                cy.get('a').each(($link) => {
                                                        if ($link.attr('href')?.includes(prepareAppealData?.finalCommentsLink)) {
                                                                const parts = $link.attr('href')?.split('/');
                                                                appealId = parts?.[parts.length - 2];
                                                                cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
                                                                return false;
                                                        }
                                                });
                                        });
                                }
                                counter++;
                        }
                })
        })

        it(`Final Comment url`, () => {
                cy.url().should('include', `/appeals/final-comments/${appealId}/submit-final-comments`);
        });

        it(`Validate to submit any Final comments error validation`, () => {
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
                cy.get('input[name="appellantFinalComment"]').should('exist');
                cy.get('input[name="appellantFinalComment"]').then(($radoButton) => {
                        const checked = $radoButton.filter(':checked')
                        if (checked.length > 0) {
                                cy.log("Radio Button already selected");
                                cy.getByData(basePage?._selectors?.answerYes).click();
                        } else {
                                cy.advanceToNextPage();
                                cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#appellantFinalComment').and('contain.text', 'Select yes if you want to submit any final comments');
                        }

                });
        });

        it(`Validate sensitive information text`, () => {
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.get('#appellantFinalCommentDetails').clear();
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Enter your final comments');
        });

        it(`Validate sensitive information check box`, () => {
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.get('#appellantFinalCommentDetails').clear();
                cy.get('#appellantFinalCommentDetails').type("Final comment test");
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'You must confirm that you have not included any sensitive information in your final comments');
        });

        it(`Validate back button`, () => {
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.get('#appellantFinalCommentDetails').clear();
                cy.get('#appellantFinalCommentDetails').type("Final comment test");
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'You must confirm that you have not included any sensitive information in your final comments');
                basePage.backBtn();
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
        });
        it(`Validate additional documents validation`, () => {
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.get('#appellantFinalCommentDetails').clear();
                cy.get('#appellantFinalCommentDetails').type("Final comment test");
                cy.get('#sensitiveInformationCheckbox').check({ force: true });
                cy.advanceToNextPage();
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you have additional documents to support your final comments?');
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                // Added below to test remove exisiting uploaded file to test error message
                const expectedFileNames = [finalCommentTestCases[0]?.documents?.uploadSupportDocsFinalComments, finalCommentTestCases[0]?.documents?.uploadAdditionalDocsSupportFinalComments];
                expectedFileNames.forEach((fileName) => {
                        cy.uploadFileFromFixtureDirectory(fileName);
                });
                expectedFileNames.forEach((fileName, index) => {
                        cy.get('.moj-multi-file-upload__filename')
                                .eq(index)
                                .should('contain.text', fileName);
                });
                deleteUploadedDocuments();

                cy.advanceToNextPage();
                cy.containsMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select your new supporting documents');
        });
        it(`Validate user should not be allowed to upload wrong format file`, () => {
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.get('#appellantFinalCommentDetails').clear();
                cy.get('#appellantFinalCommentDetails').type("Final comment test");
                cy.get('#sensitiveInformationCheckbox').check({ force: true });
                cy.advanceToNextPage();
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.uploadFileFromFixtureDirectory(finalCommentTestCases[0]?.documents?.uploadWrongFormatFile);
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage('a[href*="#uploadAppellantFinalCommentDocuments"]', `${finalCommentTestCases[0]?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG, PNG, XLS or XLSX`);
        });

        it(`Validate user should not be able to uploading document(s) greater than 25 MB`, () => {
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.get('#appellantFinalCommentDetails').clear();
                cy.get('#appellantFinalCommentDetails').type("Final comment test");
                cy.get('#sensitiveInformationCheckbox').check({ force: true });
                cy.advanceToNextPage();
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.uploadFileFromFixtureDirectory(finalCommentTestCases[0]?.documents?.uploadFileGreaterThan25mb);
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage('a[href*="#uploadAppellantFinalCommentDocuments"]', `${finalCommentTestCases[0]?.documents?.uploadFileGreaterThan25mb} must be smaller than 25MB`);
        });

        it(`Validate final comments summary before submit final comments`, () => {
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.get('#appellantFinalCommentDetails').clear();
                cy.get('#appellantFinalCommentDetails').type("Final comment test");
                cy.get('#sensitiveInformationCheckbox').check({ force: true });
                cy.advanceToNextPage();
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                const expectedFileNames = [finalCommentTestCases[0]?.documents?.uploadSupportDocsFinalComments, finalCommentTestCases[0]?.documents?.uploadAdditionalDocsSupportFinalComments];
                expectedFileNames.forEach((fileName) => {
                        cy.uploadFileFromFixtureDirectory(fileName);
                });
                cy.advanceToNextPage();
                basePage.verifyPageHeading('Check your answers and submit your final comments');
                const expectedRows = [
                        {
                                key: 'Do you want to submit any final comments?',
                                hrefContains: `/appeals/final-comments/${appealId}/submit-final-comments`
                        },
                        {
                                key: 'Add your final comments',
                                hrefContains: `/appeals/final-comments/${appealId}/final-comments`
                        },
                        {
                                key: 'Do you have additional documents to support your final comments?',
                                hrefContains: `/appeals/final-comments/${appealId}/additional-documents`,
                                optional: true
                        },
                        {
                                key: 'New supporting documents',
                                hrefContains: `/appeals/final-comments/${appealId}/upload-supporting-documents`,
                                optional: true
                        }
                ];
                cy.get(basePage?._selectors.govukSummaryListRow).each(($row, index) => {
                        const expected = expectedRows[index];
                        if (!expected) return;
                        const rowText = $row.text().trim();
                        if (expected.optional && !rowText.includes(expected.key)) {
                                cy.log('Skipping optional row:${expected.key}');
                                return;
                        }
                        expect(rowText).to.include(expected.key);
                        cy.wrap($row).find(basePage?._selectors.govukSummaryListActionsagovuklink).should('contain.text', 'Change').and('have.attr', 'href').then((href) => {
                                expect(href).to.include(expected.hrefContains);
                        });
                });
        });
});
