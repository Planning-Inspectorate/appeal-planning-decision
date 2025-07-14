
/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>
//import { fullAppealStatementTestCases } from "../../helpers/lpaManageAppeals/fullAppealStatementData";
import { r6FullAppealsStatementTestCases } from "../../helpers/rule6Appeals/r6FullAppealsStatementData";
import { BasePage } from "../../page-objects/base-page";
import { upload25MBFileValidation } from "../../utils/uploadService";
import { StringUtils } from "../../utils/StringUtils";
import { deleteUploadedDocuments } from "../../utils/deleteUploadedDocuments";
import { users } from '../../fixtures/users.js';
const { fullAppealStatement } = require('../../support/flows/sections/lpaManageAppeals/fullAppealStatement');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('Full Planning Statement Test Cases', () => {
    const yourAppealsSelector = new YourAppealsSelector();
    const basePage = new BasePage();
    const stringUtils = new StringUtils();
    //const deleteUploadedDocuments = new DeleteUploadedDocuments();
    let lpaManageAppealsData;
    let appealId;

    beforeEach(() => {
        cy.login(users.appeals.authUser);
        cy.fixture('lpaManageAppealsData').then(data => {
            lpaManageAppealsData = data;
        })
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/rule-6/email-address`);
        cy.url().then((url) => {
            if (url.includes('/rule-6/email-address')) {
                cy.getByData(yourAppealsSelector?._selectors?.emailAddress).clear();
                cy.getByData(yourAppealsSelector?._selectors?.emailAddress).type(lpaManageAppealsData?.rule6EmailAddress);
                cy.advanceToNextPage();
                cy.get(yourAppealsSelector?._selectors?.emailCode).type(lpaManageAppealsData?.emailCode);
                cy.advanceToNextPage();
            }
        });
        let counter = 0;
        cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
            const rowtext = $row.text();
            if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && rowtext.includes(lpaManageAppealsData?.todoStatement)) {
                if (counter === 0) {
                    cy.log(rowtext);
                    cy.wrap($row).within(() => {
                        cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType).should('be.visible');
                        cy.get('a').each(($link) => {
                            if ($link.attr('href')?.includes('appeal-statement')) {
                                cy.log(lpaManageAppealsData?.todoStatement);
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

    it(`Statement url`, () => {
        cy.url().should('include', `rule-6/appeal-statement/${appealId}/appeal-statement`);
    });

    it(`Validate Appeal statement error validation`, () => {
        basePage?.basePageElements?.pageHeading().contains('Appeal statement');
        cy.get('#rule6Statement').clear();
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Enter your statement');
    });
    it(`Validate Appeal statement more than 32500 cahracters validation`, () => {
        const longText = stringUtils.generateLongString(32501);
        cy.get('#rule6Statement').invoke('val', longText).trigger('input');
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Your statement must be 32,500 characters or less');
        cy.advanceToNextPage();
    });

    it(`Validate Additional Document statement error validation`, () => {
        cy.get('#rule6Statement').clear();
        cy.get('#rule6Statement').type("Final comment test");
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you have additional documents to support your appeal statement?');
        cy.get('input[name="rule6AdditionalDocuments"]:checked').then(($checked) => {
            if ($checked.length > 0) {
                return;
            }
            else {
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select yes if you have additional documents to support your appeal statement');
            }
        })
    });

    it(`Validate upload your new supporting documents Error message and remove if exists`, () => {
        cy.advanceToNextPage();
        cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
        cy.advanceToNextPage();
        basePage?.basePageElements?.pageHeading().contains('Upload your new supporting documents');
        deleteUploadedDocuments();
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select your new supporting documents');
    });

    it(`Validate user should not be allowed to upload wrong format file`, () => {
        cy.advanceToNextPage();
        cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
        cy.advanceToNextPage()
        cy.uploadFileFromFixtureDirectory(r6FullAppealsStatementTestCases[0]?.documents?.uploadWrongFormatFile);
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage('a[href*="#uploadRule6StatementDocuments"]', `${r6FullAppealsStatementTestCases[0]?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG or PNG`);
    });

    it(`Validate multiple uploading documents`, () => {
        const expectedFileNames = [r6FullAppealsStatementTestCases[0]?.documents?.uploadEmergingPlan, r6FullAppealsStatementTestCases[0]?.documents?.uploadOtherPolicies];

        cy.advanceToNextPage();
        cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
        cy.advanceToNextPage();
        deleteUploadedDocuments();
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
                key: 'Appeal statement', value: lpaManageAppealsData?.statements?.lpaStatementTextInput
            },
            {
                key: 'Add supporting documents', value: 'Yes'
            },
            {
                key: 'Supporting documents', value: r6FullAppealsStatementTestCases[0]?.documents?.uploadEmergingPlan
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