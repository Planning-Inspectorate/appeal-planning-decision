/// <reference types="cypress"/>
// @ts-nocheck

//import { BasePage } from "test-packages/platform-feature-tests/cypress/page-objects/base-page";
import { BasePage } from "../../../page-objects/base-page";
//const { CASE_TYPES } = require('@pins/common/src/database/data-static');

export const validateAppealDetailsForAppellant = (appealId) => {
    const basePage = new BasePage();
    let prepareAppealData;
    cy.fixture('prepareAppealData').then(data => {
        prepareAppealData = data;
    });
    cy.get(`a[href="/appeals/${appealId}"]`).click();
    basePage.verifyPageHeading('Appeal ${appealId}');

    const expectedData = [
        {
            key: 'Appeal type', value: 'Full planning'
        },
        {
            key: 'Appeal procedure', value: 'Written'
        },
        {
            key: 'Appeal site', value: prepareAppealData.siteAddress?.addressLine1 + ', ' + prepareAppealData.siteAddress?.addressLine2 + ', ' + prepareAppealData.siteAddress?.townOrCity + ', ' + prepareAppealData.siteAddress?.postcode
        },
        {
            key: 'Applicant', value: prepareAppealData.applicationName?.firstName + ' ' + prepareAppealData.applicationName?.lastName
        },
        {
            key: 'Local planning authority', value: 'System Test 2 Borough Council'
        },
        {
            key: 'Application number', value: 'TEST-171947077123712345x6'
        }
    ]
    cy.get(basePage?._selectors?.govukSummaryListRow).each(($row, index) => {
        const expected = expectedData[index];
        cy.wrap($row).within(() => {
            cy.get(basePage?._selectors?.govukSummaryListKey).should('contain', expected.key);
            cy.get(basePage?._selectors?.govukSummaryListValue).should('contain', expected.value);
        })
    });
    basePage.verifyPageHeading('Appeal details');
    cy.get(`a[href="/appeals/${appealId}/appeal-details"]`).click();
    basePage.verifyPageHeading('Appeal ${appealId}');
    basePage.verifyPageHeading('Appeal details');
    cy.get(`a[href="/appeals/${appealId}/appeal-details"]`).click();
    const expectedData2 = [
        {
            key: 'Appeal type', value: 'Full planning'
        },
        {
            key: 'Appeal procedure', value: 'Written'
        },
        {
            key: 'Appeal site', value: prepareAppealData.siteAddress?.addressLine1 + ', ' + prepareAppealData.siteAddress?.addressLine2 + ', ' + prepareAppealData.siteAddress?.townOrCity + ', ' + prepareAppealData.siteAddress?.postcode
        },
        {
            key: 'Applicant', value: prepareAppealData.applicationName?.firstName + ' ' + prepareAppealData.applicationName?.lastName
        },
        {
            key: 'Local planning authority', value: 'System Test 2 Borough Council'
        },
        {
            key: 'Application number', value: 'TEST-171947077123712345x6'
        }
    ]
    cy.get(basePage?._selectors?.govukSummaryListRow).each(($row, index) => {
        const expected = expectedData2[index];
        cy.wrap($row).within(() => {
            cy.get(basePage?._selectors?.govukSummaryListKey).should('contain', expected.key);
            cy.get(basePage?._selectors?.govukSummaryListValue).should('contain', expected.value);
        })
    });
    basePage.verifyPageHeading('Your appeal');
    const expectedData3 = [
        {
            key: 'Was the application made in your name?', value: 'Full planning'
        },
        {
            key: 'Contact details', value: 'Written'
        },
        {
            key: 'Site address', value: prepareAppealData.siteAddress?.addressLine1 + ', ' + prepareAppealData.siteAddress?.addressLine2 + ', ' + prepareAppealData.siteAddress?.townOrCity + ', ' + prepareAppealData.siteAddress?.postcode
        },
        {
            key: 'What is the area of the appeal site?', value: prepareAppealData.applicationName?.firstName + ' ' + prepareAppealData.applicationName?.lastName
        },
        {
            key: 'Is the site in a green belt', value: 'System Test 2 Borough Council'
        },
        {
            key: 'Site fully owned', value: 'TEST-171947077123712345x6'
        },
        {
            key: 'Site partly owned', value: 'Written'
        },
        {
            key: 'All owners known', value: 'Written'
        },
        {
            key: 'Other owners identified', value: 'Written'
        },
        {
            key: 'Advertised appeal', value: 'Written'
        },
        {
            key: 'Other owners informed', value: 'Written'
        },
        {
            key: 'Will an inspector need to access the land or property?', value: 'Written'
        },
        {
            key: 'Agricultural holding', value: 'Written'
        },
        {
            key: 'Site health and safety issues', value: 'Written'
        },
        {
            key: 'Application reference', value: 'Written'
        },
        {
            key: 'What date did you submit your planning application?', value: 'Written'
        },
        {
            key: 'What is the development type?', value: 'Written'
        },
        {
            key: 'Enter the description of development', value: 'Written'
        },
        {
            key: 'Did the local planning authority change the description of development?', value: 'Written'
        },
        {
            key: 'Preferred procedure', value: 'Written'
        },
        {
            key: 'Are there other appeals linked to your development?', value: 'Written'
        },
        {
            key: 'Do you need to apply for an award of appeal costs?', value: 'Written'
        },
        {
            key: 'Contact details', value: 'Written'
        },
        {
            key: 'Contact details', value: 'Written'
        },
        {
            key: 'Contact details', value: 'Written'
        },
        {
            key: 'Contact details', value: 'Written'
        },
        {
            key: 'Contact details', value: 'Written'
        },
        {
            key: 'Contact details', value: 'Written'
        },
        {
            key: 'Contact details', value: 'Written'
        },
        {
            key: 'Contact details', value: 'Written'
        },
        {
            key: 'Contact details', value: 'Written'
        }
    ]
    cy.get(basePage?._selectors?.govukSummaryListRow).each(($row, index) => {
        const expected = expectedData3[index];
        cy.wrap($row).within(() => {
            cy.get(basePage?._selectors?.govukSummaryListKey).should('contain', expected.key);
            cy.get(basePage?._selectors?.govukSummaryListValue).should('contain', expected.value);
        })
    });








    cy.get('#tab_waiting-for-review').click();
    cy.get(basePage?._selectors.trgovukTableRow).should('exist');
    return cy.get('table tr').last().find('td').eq(0).invoke('text').then((text) => {
        const appealId = text.trim();
        Cypress.log({ name: 'Appeal ID', message: appealId });
        return cy.wrap(appealId); // Return the appeal ID for further use
    });
}