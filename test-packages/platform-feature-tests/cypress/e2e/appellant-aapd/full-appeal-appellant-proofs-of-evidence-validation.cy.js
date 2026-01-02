// @ts-nocheck
/// <reference types="cypress"/>
import { proofsOfEvidenceTestCases } from "../../helpers/appellantAAPD/proofsOfEvidenceData";
import { BasePage } from "../../page-objects/base-page";
import { deleteUploadedDocuments } from "../../utils/deleteUploadedDocuments";
import { users } from '../../fixtures/users.js';
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");

describe('Appellant Full Planning Proof Of Evidence Validations', { tags: '@S78-appellant-POE-Validation' }, () => {
    const prepareAppealSelector = new PrepareAppealSelector();
    const basePage = new BasePage();
    // const stringUtils = new StringUtils();
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
            if (rowtext.includes(prepareAppealData?.FullAppealType) && rowtext.includes(prepareAppealData?.todoProofsOfEvidence)) {
                if (counter === 0) {
                    cy.wrap($row).within(() => {
                        cy.get(basePage?._selectors.trgovukTableCell).contains(prepareAppealData?.FullAppealType).should('be.visible');
                        cy.get('a').each(($link) => {
                            if ($link.attr('href')?.includes(prepareAppealData?.proofsOfEvidenceLink)) {
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

    it(`Validate Proof of Evidence url`, () => {
        cy.url().should('include', `appeals/proof-evidence/${appealId}/upload-proof-evidence`);
    });

    it(`Validate Upload Proof of Evidence page error validation`, () => {

        cy.get(basePage?._selectors.govukHeadingOne).contains('Upload your proof of evidence and summary');
        if (cy.get(basePage?._selectors.govukHeadingM).contains('Files added')) {
            cy.advanceToNextPage();
        }
        else {
            cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select your proof of evidence and summary');
        }
    });

    it(`Validate user should not be allowed to upload wrong format file`, () => {
        cy.uploadFileFromFixtureDirectory(proofsOfEvidenceTestCases[0]?.documents?.uploadWrongFormatFile);
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage('a[href*="#uploadAppellantProofOfEvidenceDocuments"]', `${proofsOfEvidenceTestCases[0]?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG, PNG or XLSX`);
    });
    it(`Validate user should not be able to uploading document(s) greater than 25 MB`, () => {
        cy.uploadFileFromFixtureDirectory(proofsOfEvidenceTestCases[0]?.documents?.uploadFileGreaterThan25mb);
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage('a[href*="#uploadAppellantProofOfEvidenceDocuments"]', `${proofsOfEvidenceTestCases[0]?.documents?.uploadFileGreaterThan25mb} must be smaller than 25MB`);
    });
    it(`Validate multiple uploading documents`, () => {
        const expectedFileNames = [proofsOfEvidenceTestCases[0]?.documents?.uploadEmergingPlan, proofsOfEvidenceTestCases[0]?.documents?.uploadOtherPolicies];

        deleteUploadedDocuments();
        cy.advanceToNextPage();
        cy.containsMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select your proof of evidence and summary');

        expectedFileNames.forEach((fileName) => {
            cy.uploadFileFromFixtureDirectory(fileName);
        })
        expectedFileNames.forEach((fileName, index) => {
            cy.get('.moj-multi-file-upload__filename')
                .eq(index)
                .should('contain.text', fileName);
        });
        cy.advanceToNextPage();
    });

    it(`Validate add witnesses`, () => {
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you need to add any witnesses?');
        cy.get('input[name="appellantWitnesses"]').then(($input) => {
            const checked = $input.filter(':checked')
            cy.log('Check status', checked);
            if (checked.length > 0) {
                cy.getByData(basePage?._selectors?.answerYes).click();
            }
            else {
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select yes if you need to add any witnesses');
                cy.getByData(basePage?._selectors?.answerYes).click();
                cy.advanceToNextPage();
            }
        })
    });
    it(`Validate Upload Witnesses Evidence page error validation`, () => {
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukHeadingOne).contains('Upload your witnesses and their evidence');
        if (cy.get(basePage?._selectors.govukHeadingM).contains('Files added')) {
            cy.advanceToNextPage();
        }
        else {
            cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select your witnesses and their evidence');
        }
    });

    it(`Validate user should not be allowed to upload wrong format file`, () => {
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        cy.uploadFileFromFixtureDirectory(proofsOfEvidenceTestCases[0]?.documents?.uploadWrongFormatFile);
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage('a[href*="#uploadAppellantWitnessesEvidence"]', `${proofsOfEvidenceTestCases[0]?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG, PNG or XLSX`);
    });

    // it(`Validate user should not be able to uploading document(s) greater than 25 MB for Upload your witnesses and their evidence`, () => {
    //     cy.advanceToNextPage();
    //     cy.advanceToNextPage();
    //     cy.uploadFileFromFixtureDirectory(proofsOfEvidenceTestCases[0]?.documents?.uploadFileGreaterThan25mb);
    //     cy.advanceToNextPage();
    //     cy.shouldHaveErrorMessage('a[href*="#uploadAppellantWitnessesEvidence"]', `${proofsOfEvidenceTestCases[0]?.documents?.uploadFileGreaterThan25mb} must be smaller than 25MB`);
    // });
    it(`Validate multiple uploading documents for Upload your witnesses and their evidence`, () => {
        const expectedFileNames = [proofsOfEvidenceTestCases[0]?.documents?.uploadEmergingPlan, proofsOfEvidenceTestCases[0]?.documents?.uploadOtherPolicies];
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        deleteUploadedDocuments();
        cy.advanceToNextPage();
        cy.containsMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select your witnesses and their evidence');

        expectedFileNames.forEach((fileName) => {
            cy.uploadFileFromFixtureDirectory(fileName);
        })
        expectedFileNames.forEach((fileName, index) => {
            cy.get('.moj-multi-file-upload__filename')
                .eq(index)
                .should('contain.text', fileName);
        });
        cy.advanceToNextPage();
    });

    it(`Validate Proof of evidence summary before submit`, () => {
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukHeadingOne).contains('Check your answers and submit your proof of evidence');
        const expectedRows = [
            {
                key: 'Your proof of evidence and summary',
                hrefContains: `/appeals/proof-evidence/${appealId}/upload-proof-evidence`
            },
            {
                key: 'Added witnesses',
                hrefContains: `/appeals/proof-evidence/${appealId}/add-witnesses`
            },
            {
                key: 'Witness proof of evidence and summary',
                hrefContains: `/appeals/proof-evidence/${appealId}/upload-witnesses-evidence`,
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
