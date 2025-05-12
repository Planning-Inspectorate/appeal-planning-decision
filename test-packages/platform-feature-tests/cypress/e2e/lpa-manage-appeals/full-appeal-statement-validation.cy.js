
/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>
import { fullAppealStatementTestCases } from "../../helpers/lpaManageAppeals/fullAppealStatementData";
import { BasePage } from "../../page-objects/base-page";
import { upload25MBFileValidation } from "../../utils/uploadService";
import { StringUtils } from "../../utils/StringUtils";
const { fullAppealStatement } = require('../../support/flows/sections/lpaManageAppeals/fullAppealStatement');
const { YourAppealsSelector } = require("../../page-objects/lpa-manage-appeals/your-appeals-selector");

describe('Full Planning Statement Test Cases', () => {
    const yourAppealsSelector = new YourAppealsSelector();
    const basePage = new BasePage();
    const stringUtils = new StringUtils();
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
            if (rowtext.includes(lpaManageAppealsData?.s78AppealType) && rowtext.includes(lpaManageAppealsData?.todoStatement)) {
                if (counter === 2) {
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
        cy.url().should('include', `manage-appeals/appeal-statement/${appealId}/appeal-statement`);
    });

    it(`Validate Appeal statement error validation`, () => {
        basePage?.basePageElements?.pageHeading().contains('Appeal statement');
        cy.get('#lpaStatement').clear();
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Enter your statement');
        //cy.get('#lpaStatement').type(lpaManageAppealsData?.statements?.lpaStatementTextInput);
       // cy.advanceToNextPage();
    });
    it(`Validate Appeal statement more than 32500 cahracters validation`, () => {  
        //const longText = 'a'.repeat(32501);
        //const longText = () => Cypress._.random(0,32501) 
        const longText = stringUtils.generateLongString(32501);  
        //cy.get('#lpaStatement').type(longText);
        cy.get('#lpaStatement').invoke('val',longText).trigger('input');
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Your statement must be 32,500 characters or less');
        cy.advanceToNextPage();
    });   

    it(`Validate Additional Document statement error validation`, () => {
        cy.get('#lpaStatement').clear();
        cy.get('#lpaStatement').type("Final comment test");
        cy.advanceToNextPage();
       // cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukFieldsetHeading).contains('Do you have additional documents to support your appeal statement?');
        cy.get('input[name="additionalDocuments"]:checked').then(($checked) => {
            if ($checked.length > 0) {
                cy.log("Radio Button already selected");
                return;
            }
            else {
                cy.advanceToNextPage();
                cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select yes if you have additional documents to support your appeal statement');
            }
        })
    });


    it(`Validate upload your new supporting documents Error message`, () => {
        const expectedFileNames = [fullAppealStatementTestCases[0]?.documents?.uploadEmergingPlan, fullAppealStatementTestCases[0]?.documents?.uploadOtherPolicies];
        cy.advanceToNextPage();
        cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
        cy.advanceToNextPage();
        basePage?.basePageElements?.pageHeading().contains('Upload your new supporting documents');
        expectedFileNames.forEach(() => {
            cy.get('.moj-multi-file-upload__delete')
                .eq(0)
                .click()
        });    
        cy.advanceToNextPage();
        cy.shouldHaveErrorMessage(basePage?._selectors?.govukErrorSummaryBody, 'Select your new supporting documents');
    });   

    it(`Validate user should not be allowed to upload wrong format file`, () => {        
          cy.uploadFileFromFixtureDirectory(fullAppealStatementTestCases[0]?.documents?.uploadWrongFormatFile);
          cy.advanceToNextPage();
          cy.shouldHaveErrorMessage('a[href*="#uploadLpaStatementDocuments"]', `${fullAppealStatementTestCases[0]?.documents?.uploadWrongFormatFile} must be a DOC, DOCX, PDF, TIF, JPG or PNG`);
      });
  

    it(`Validate multiple uploading documents`, () => {      
        //const expectedFileNames = ['emerging-plan.pdf', 'other-policies.pdf'];
        const expectedFileNames = [fullAppealStatementTestCases[0]?.documents?.uploadEmergingPlan, fullAppealStatementTestCases[0]?.documents?.uploadOtherPolicies];
        
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
                key:'Appeal statement',value:lpaManageAppealsData?.statements?.lpaStatementTextInput
            },
            {
                key:'Add supporting documents',value:'Yes'
            },
            {
                key:'Supporting documents', value:fullAppealStatementTestCases[0]?.documents?.uploadEmergingPlan
            }
        ]
        cy.get(basePage?._selectors?.govukSummaryListRow).each(($row,index)=>{
            const expected = expectedData[index];
            cy.wrap($row).within(()=>{
                cy.get(basePage?._selectors?.govukSummaryListKey).should('contain',expected.key);
                cy.get(basePage?._selectors?.govukSummaryListValue).should('contain',expected.value);
                // cy.get(basePage?._selectors?.govukSummaryListValue).invoke('text').then(text=>{
                //     const normalisedText = text.replace(/\s+/g,' ').trim();
                //     expect(normalisedText).to.include(expected.value)
                // })
            })
        })
    });

    // it('validate Appeal Statement Summary',() => {


    // })



    // uploadEmergingPlan: 'emerging-plan.pdf',
    // uploadOtherPolicies: 'other-policies.pdf',
    // uploadSupplementaryPlanningDocs: 'supplementary-planning-docs.pdf',
    // uploadCommunityInfrastructureLevy: 'community-infrastructure-levy.pdf'

    
    // it(`Validate user should not be able to upload document(s) greater than 25 MB`, () => {
    //     // cy.get('a[href*="upload-supporting-documents"]').first().click();
    //     cy.advanceToNextPage();
    //     //cy.uploadFileFromFixtureDirectory(fullAppealStatementTestCases?.documents?.uploadFileGreaterThan25mb);
    //     cy.uploadFileFromFixtureDirectory("greater-than-25-mb.docx");
    //     cy.advanceToNextPage();
    //     cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]', `${fullAppealStatementTestCases?.documents?.uploadFileGreaterThan25mb} must be smaller than 25MB`);
    // });
    // it(`Validate user should not be able to uploading document(s) greater than 25 MB`, () => {
    //     cy.get('a[href*="upload-documents"]').first().click();
    //     cy.uploadFileFromFixtureDirectory(context?.documents?.uploadFileGreaterThan25mb);
    //     cy.advanceToNextPage();
    //     cy.shouldHaveErrorMessage('a[href*="uploadOriginal"]', `${context?.documents?.uploadFileGreaterThan25mb} must be smaller than 25MB`);
    // });
    // it(`Validate upload files larger than 25mb`, () => {

    //     cy.advanceToNextPage();
    //     cy.getByData(basePage?._selectors?.answerYes).click({ force: true });
    //     cy.advanceToNextPage();
    //     cy.get('body').then(($body) => {
    //         if ($body.find('.moj-multi-file-upload__delete').length > 0) {
    //             cy.get('.moj-multi-file-upload__delete')
    //                 .eq(0)
    //                 .click()
    //         }
    //     })
    //     upload25MBFileValidation(fullAppealStatementTestCases[0]);


    //     cy.advanceToNextPage();

    // });
   
});