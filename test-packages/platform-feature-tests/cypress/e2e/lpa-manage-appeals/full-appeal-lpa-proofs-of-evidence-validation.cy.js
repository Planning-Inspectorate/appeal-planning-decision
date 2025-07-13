// @ts-nocheck
/// <reference types="cypress"/>
import { proofsOfEvidenceTestCases } from "../../helpers/lpaManageAppeals/proofsOfEvidenceData";
import { BasePage } from "../../page-objects/base-page";
const { fullAppealProofsOfEvidence } = require('../../support/flows/sections/lpaManageAppeals/proofsOfEvidence');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('LPA Proof of Evidence Validations', () => {
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
            if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && rowtext.includes(lpaManageAppealsData?.lpaTodoProofsOfEvidence)) {
                if (counter === 1) {
                    cy.wrap($row).within(() => {
                        cy.get(basePage?._selectors.trgovukTableCell).contains(lpaManageAppealsData?.s78AppealType || lpaManageAppealsData?.s20AppealType).should('be.visible');
                        cy.get('a').each(($link) => {
                            if ($link.attr('href')?.includes(lpaManageAppealsData?.proofsOfEvidenceLink)) {
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

    it(`Validate Proof of Evidence url`, () => {
        cy.url().should('include', `manage-appeals/proof-evidence/${appealId}/upload-proof-evidence`);
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
        cy.shouldHaveErrorMessage('a[href*="#uploadLpaProofOfEvidenceDocuments"]', `${proofsOfEvidenceTestCases[0]?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG or PNG`);
    });

    // it(`Validate user should not be able to uploading document(s) greater than 25 MB`, () => {
    //     cy.uploadFileFromFixtureDirectory(r6FullAppealsProofsOfEvidenceTestCases[0]?.documents?.uploadFileGreaterThan25mb);
    //     cy.advanceToNextPage();
    //     cy.shouldHaveErrorMessage('a[href*="#uploadRule6ProofOfEvidenceDocuments"]', `${r6FullAppealsProofsOfEvidenceTestCases[0]?.documents?.uploadFileGreaterThan25mb} must be smaller than 25MB`);
    // });

    it(`Validate multiple uploading documents`, () => {
        const expectedFileNames = [proofsOfEvidenceTestCases[0]?.documents?.uploadEmergingPlan, proofsOfEvidenceTestCases[0]?.documents?.uploadOtherPolicies];
        
        if (cy.get(basePage?._selectors.govukHeadingM).contains('Files added')) {
            cy.get('button.moj-multi-file-upload__delete').each(($buttons) => {
                if ($buttons.length) {
                        cy.get('button.moj-multi-file-upload__delete').eq(0).click();
                }
            })
        }
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
        cy.get('input[name="lpaWitnesses"]').then(($input) => {
            const checked = $input.filter(':checked')
            if (checked.length > 0) {
                cy.log("Radio Button already selected");
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

    it(`Validate user should not be allowed to upload wrong format file for Upload your witnesses and their evidence`, () => {
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        cy.uploadFileFromFixtureDirectory(proofsOfEvidenceTestCases[0]?.documents?.uploadWrongFormatFile);
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage('a[href*="#uploadLpaWitnessesEvidence"]', `${proofsOfEvidenceTestCases[0]?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG or PNG`);
    });
    // it(`Validate user should not be able to uploading document(s) greater than 25 MB for Upload your witnesses and their evidence`, () => {
    //     cy.advanceToNextPage();
    //     cy.advanceToNextPage();
    //     cy.uploadFileFromFixtureDirectory(proofsOfEvidenceTestCases[0]?.documents?.uploadFileGreaterThan25mb);
    //     cy.advanceToNextPage();
    //     cy.shouldHaveErrorMessage('a[href*="#uploadLpaWitnessesEvidence"]', `${proofsOfEvidenceTestCases[0]?.documents?.uploadFileGreaterThan25mb} must be smaller than 25MB`);
    // }); 
    it(`Validate multiple uploading documents Upload your witnesses and their evidence`, () => {
        const expectedFileNames = [proofsOfEvidenceTestCases[0]?.documents?.uploadEmergingPlan, proofsOfEvidenceTestCases[0]?.documents?.uploadOtherPolicies];
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        if (cy.get(basePage?._selectors.govukHeadingM).contains('Files added')) {
            cy.get('button.moj-multi-file-upload__delete').each(($buttons) => {
                if ($buttons.length) {
                        cy.get('button.moj-multi-file-upload__delete').eq(0).click();
                }
            })
        }        
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

    it(`Validate Proof of evidence summary before submit final comments`, () => {
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukHeadingOne).contains('Check your answers and submit your proof of evidence');
        const expectedRows = [
            {
                key: 'Your proof of evidence and summary',
                hrefContains: `/manage-appeals/proof-evidence/${appealId}/upload-proof-evidence`
            },
            {
                key: 'Added witnesses',
                hrefContains: `/manage-appeals/proof-evidence/${appealId}/add-witnesses`
            },
            {
                key: 'Witness proof of evidence and summary',
                hrefContains: `/manage-appeals/proof-evidence/${appealId}/upload-witnesses-evidence`,
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