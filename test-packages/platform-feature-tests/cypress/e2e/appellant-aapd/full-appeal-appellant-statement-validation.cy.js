
/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>
import { statementTestCases } from "../../helpers/appellantAAPD/statementData";
import { BasePage } from "../../page-objects/base-page";
import { deleteUploadedDocuments } from "../../utils/deleteUploadedDocuments";
import { StringUtils } from "../../utils/stringUtils";
import { users } from '../../fixtures/users.js';
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");

describe('Full Planning Statement Test Cases', { tags: '@S78-appellant-statement-Validation' }, () => {
    const prepareAppealSelector = new PrepareAppealSelector();
    const basePage = new BasePage();
    const stringUtils = new StringUtils();
    let prepareAppealData;
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
                cy.getById(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress1);
                cy.advanceToNextPage();
                cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
                cy.advanceToNextPage();
            }
        });

        let counter = 0;
        cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
            const rowtext = $row.text();
            if (rowtext.includes(prepareAppealData?.s78AppealType) && rowtext.includes(prepareAppealData?.todoStatement)) {
                if (counter === 0) {
                    cy.wrap($row).within(() => {
                        cy.get(basePage?._selectors.trgovukTableCell).contains(prepareAppealData?.s78AppealType).should('be.visible');
                        cy.get('a').each(($link) => {
                            if ($link.attr('href')?.includes('appeal-statement')) {
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

    it(`Statement url`, () => {
        cy.url().should('include', `appeals/appeal-statement/${appealId}/appeal-statement`);
    });

    it(`Validate Appeal statement error validation`, () => {
        basePage?.basePageElements?.pageHeading().contains('Appeal statement');
        cy.get('#appellantStatement').clear();
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Enter your statement');
    });

    it(`Validate Appeal statement more than 32500 cahracters validation`, () => {
        const longText = stringUtils.generateLongString(32501);
        cy.get('#appellantStatement').invoke('val', longText).trigger('input');
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Your statement must be 32,500 characters or less');
        cy.advanceToNextPage();
    });

    it(`Validate Additional Document statement error validation`, () => {
        cy.get('#appellantStatement').clear();
        cy.get('#appellantStatement').type("Final comment test");
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you have additional documents to support your appeal statement?');
        cy.get('input[name="additionalDocuments"]:checked').then(($checked) => {
            if ($checked.length > 0) {
                return;
            }
            else {
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select yes if you have additional documents to support your appeal statement');
            }
        })
    });

    it(`Validate upload your new supporting documents Error message`, () => {
        cy.advanceToNextPage();
        cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
        cy.advanceToNextPage();
        basePage?.basePageElements?.pageHeading().contains('Upload your new supporting documents');
        deleteUploadedDocuments();
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select your new supporting documents');
    });

    it(`Validate user should not be allowed to upload wrong format file`, () => {
        cy.uploadFileFromFixtureDirectory(statementTestCases[0]?.documents?.uploadWrongFormatFile);
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage('a[href*="#uploadLpaStatementDocuments"]', `${statementTestCases[0]?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG, PNG, XLS or XLSX`);
    });

    it(`Validate multiple uploading documents`, () => {
        const expectedFileNames = [statementTestCases[0]?.documents?.uploadEmergingPlan, statementTestCases[0]?.documents?.uploadOtherPolicies];

        expectedFileNames.forEach((fileName) => {
            cy.uploadFileFromFixtureDirectory(fileName);
        })
        expectedFileNames.forEach((fileName, index) => {
            cy.get('.moj-multi-file-upload__filename')
                .eq(index)
                .should('contain.text', fileName);
        });
        cy.advanceToNextPage();
        const expectedData = [
            {
                key: 'Appeal statement', value: prepareAppealData?.statements?.lpaStatementTextInput
            },
            {
                key: 'Add supporting documents', value: 'Yes'
            },
            {
                key: 'Supporting documents', value: statementTestCases[0]?.documents?.uploadEmergingPlan
            }
        ]
        cy.get(basePage?._selectors?.govukSummaryListRow).each(($row, index) => {
            const expected = expectedData[index];
            cy.wrap($row).within(() => {
                cy.get(basePage?._selectors?.govukSummaryListKey).should('contain', expected.key);
                cy.get(basePage?._selectors?.govukSummaryListValue).should('contain', expected.value);
            })
        })
    });
});
