
/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>
import { fullAppealFinalCommentTestCases } from "../../helpers/lpaManageAppeals/fullAppealFinalCommentData";
import { BasePage } from "../../page-objects/base-page";
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('LPA Full Planning Final comment Test Cases', () => {
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
                        const rowtext = $row.text();
                        if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && rowtext.includes(lpaManageAppealsData?.todoFinalcomment)) {                              
                                if (counter === 0) {                                       
                                        cy.wrap($row).within(() => {
                                                cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');
                                                cy.get('a').each(($link) => {
                                                        if ($link.attr('href')?.includes('final-comments')) {                                                              
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
                });
        })

        it(`Final Comment url`, () => {
                cy.url().should('include', `/manage-appeals/final-comments/${appealId}/submit-final-comments`);
        });
        it(`Validate to submit any Final comments error validation`, () => {
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
                cy.get("#lpaFinalComment").then(($radoButton) => {
                        if ($radoButton.is(':checked')) {
                                //cy.log("Radio Button already selected");
                                return;
                        } else {
                                cy.advanceToNextPage();
                                cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#lpaFinalComment').and('contain.text', 'Select yes if you want to submit any final comments');
                        }

                });
           //below code added to handle page flow issue that navigation starting form previous navigation instead of start.      
                // cy.get('input[name="lpaFinalComment"]:checked').then(($checked) => {
                // //cy.get('input[type="radio"]').filter(':visible').filter('[value="yes"]').should(($radio) => {
                //         if($radio.prop('checked')){
                //                 cy.log("Radio Button already selected");   
                //         }
                //         else {
                //                 cy.advanceToNextPage();
                //                 cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#lpaFinalComment').and('contain.text', 'Select yes if you want to submit any final comments');
                //         }
                // });
                // if ($checked.length > 0) {
                //         cy.log("Radio Button already selected");
                //         return;
                // }
                // else {
                //         cy.advanceToNextPage();
                //         cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#lpaFinalComment').and('contain.text', 'Select yes if you want to submit any final comments');
                // }
                // })
        });

        it(`Validate sensitive information text`, () => {
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.get('#lpaFinalCommentDetails').clear();
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Enter your final comments');
        });
        it(`Validate sensitive information check box`, () => {
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.get('#lpaFinalCommentDetails').clear();
                cy.get('#lpaFinalCommentDetails').type("Final comment test");
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'You must confirm that you have not included any sensitive information in your final comments');
        });

        it(`Validate back button`, () => {
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
                cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
                cy.advanceToNextPage();
                cy.get('#lpaFinalCommentDetails').clear();
                cy.get('#lpaFinalCommentDetails').type("Final comment test");
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'You must confirm that you have not included any sensitive information in your final comments');
                basePage.backBtn();
                cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you want to submit any final comments?');
        });
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
                const expectedFileNames = [fullAppealFinalCommentTestCases[0]?.documents?.uploadSupportDocsFinalComments, fullAppealFinalCommentTestCases[0]?.documents?.uploadAdditionalDocsSupportFinalComments];
                expectedFileNames.forEach((fileName) => {
                        cy.uploadFileFromFixtureDirectory(fileName);
                });

                expectedFileNames.forEach((fileName, index) => {
                        cy.get('.moj-multi-file-upload__filename')
                                .eq(index)
                                .should('contain.text', fileName);
                });

                expectedFileNames.forEach((filename, index) => {
                        cy.get('.moj-multi-file-upload__delete')
                                .eq(expectedFileNames.length - 1 - index)
                                .click()
                })

                cy.advanceToNextPage();
                cy.containsMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select your new supporting documents');
        });

        it(`Validate user should not be allowed to upload wrong format file`, () => {
                cy.uploadFileFromFixtureDirectory(fullAppealFinalCommentTestCases[0]?.documents?.uploadWrongFormatFile);
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage('a[href*="#uploadLPAFinalCommentDocuments"]', `${fullAppealFinalCommentTestCases[0]?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG or PNG`);
        });

        it(`Validate user should not be able to uploading document(s) greater than 25 MB`, () => {               
                cy.uploadFileFromFixtureDirectory(fullAppealFinalCommentTestCases[0]?.documents?.uploadFileGreaterThan25mb);
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage('a[href*="#uploadLPAFinalCommentDocuments"]', `${fullAppealFinalCommentTestCases[0]?.documents?.uploadFileGreaterThan25mb} must be smaller than 25MB`);
        });

        it(`Validate final comments summary before submit final comments`, () => {
                const expectedFileNames = [fullAppealFinalCommentTestCases[0]?.documents?.uploadSupportDocsFinalComments, fullAppealFinalCommentTestCases[0]?.documents?.uploadAdditionalDocsSupportFinalComments];
                expectedFileNames.forEach((fileName) => {
                        cy.uploadFileFromFixtureDirectory(fileName);
                });
                cy.advanceToNextPage();
                basePage.verifyPageHeading('Check your answers and submit your final comments');
                const expectedRows = [
                        {
                                key: 'Do you want to submit any final comments?',
                                hrefContains: `/manage-appeals/final-comments/${appealId}/submit-final-comments`
                        },
                        {
                                key: 'Add your final comments',
                                hrefContains: `/manage-appeals/final-comments/${appealId}/final-comments`
                        },
                        {
                                key: 'Do you have additional documents to support your final comments?',
                                hrefContains: `/manage-appeals/final-comments/${appealId}/additional-documents`,
                                optional: true
                        },
                        {
                                key: 'New supporting documents',
                                hrefContains: `/manage-appeals/final-comments/${appealId}/upload-supporting-documents`,
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