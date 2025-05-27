// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../page-objects/base-page";
// import { users } from '../../fixtures/users.js';
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");
describe('Comment on a planning appeal validations', () => {
    const basePage = new BasePage();
    const prepareAppealSelector = new PrepareAppealSelector();
    let prepareAppealData;
    let appealId;
    beforeEach(() => {
        // cy.login(users.appeals.authUser);
        cy.fixture('prepareAppealData').then(data => {
            prepareAppealData = data;
        });
        cy.visit(`${Cypress.config('appeals_beta_base_url')}/comment-planning-appeal`);
    });
    it('should validate service name and URL for IP Comments', () => {
        cy.get(basePage?._selectors?.govukHeaderLinkGovukHeaderServiceName).should('include.text', 'Comment on a planning appeal');
        cy.url().should('include', 'https://appeals-service-test.planninginspectorate.gov.uk/comment-planning-appeal/enter-appeal-reference');

    });
    it('should Validate appeal reference number Error message', () => {
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#appeal-reference').and('contain.text', 'Enter the appeal reference number');
    });
    it('should Validate reference number not less than 7 digits Error message', () => {
        cy.get('#appeal-reference').type('12345678');
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#appeal-reference').and('contain.text', 'Appeal reference number must be 7 digits');
    });
    it('should Validate appeal reference number invalid characters Error message', () => {
        cy.get('#appeal-reference').type('ab!2341');
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#appeal-reference').and('contain.text', 'Enter the appeal reference number using letters a to z and numbers 0 to 9');
    });
    it('should Validate reference number not exist', () => {
        cy.get('#appeal-reference').clear();
        cy.get('#appeal-reference').type('AB12456');
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukLabelGovukLabel).contains('Appeal AB12456');
        cy.get(basePage?._selectors.govukBodyGovukLabelm).contains('0 results');
        cy.get(basePage?._selectors.govukBody).contains('We could not find an appeal for AB12456.');
        cy.get(basePage?._selectors.govukBody).contains('You can:');
        cy.get('a[href*="enter-appeal-reference"]').contains('find a different appeal');
        cy.get('a[href*="https://acp.planninginspectorate.gov.uk/"]').contains('Appeals Casework Portal');
        //cy.get('a[href*="enter-appeal-reference"]').click();
    });

    it('should Validate URL for enter a postcode', () => {
        cy.get('a[href*="enter-postcode"]').contains('I do not have an appeal reference number');
        cy.get('a[href*="enter-postcode"]').click();
        cy.url().should('include', 'https://appeals-service-test.planninginspectorate.gov.uk/comment-planning-appeal/enter-postcode');
    });
    it('should Validate postcode error message', () => {
        cy.get('a[href*="enter-postcode"]').click();
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#postcode').and('contain.text', 'Enter a postcode');
    });

    it('should Validate real postcode error message', () => {
        cy.get('a[href*="enter-postcode"]').click();
        cy.get('#postcode').type('abcdefghg');
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#postcode').and('contain.text', 'Enter a real postcode');
    });

    it('should Validate postcode appeal search no results', () => {
        cy.get('a[href*="enter-postcode"]').click();
        cy.get('#postcode').type('AA12BB');
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukLabelGovukLabel).contains('Appeals at AA12BB');
        cy.get(basePage?._selectors.govukBodyGovukLabelm).contains('0 results');
        cy.get(basePage?._selectors.govukBody).contains('We could not find any appeals at AA12BB.');
        cy.get(basePage?._selectors.govukBody).contains('You can:');
        cy.get('a[href*="enter-postcode"]').contains('enter a different postcode');
        cy.get('a[href*="https://acp.planninginspectorate.gov.uk/"]').contains('Appeals Casework Portal');
    });

    it(`Validate Back button when user tries to navigate previous page from ip comments reference number  page`, () => {
        cy.advanceToNextPage();
        cy.containsMessage(prepareAppealSelector?._selectors?.govukLabelGovUkLabel1, "Enter the appeal reference number");
        basePage.backBtn();
        cy.get(basePage?._selectors?.govukLabelGovukLabel).should('include.text', 'Enter the appeal reference number');
    });

    it('should allow a user to enter postcode and start the process', () => {
        // Validate I do not have an appeal reference number
        cy.get('a[href*="enter-postcode"]').click();
        // Validate URL
        cy.url().should('include', 'https://appeals-service-test.planninginspectorate.gov.uk/comment-planning-appeal/enter-postcode');

        // Input search by post code
        cy.get('#postcode').type('SW7 9PB');
        cy.advanceToNextPage();
        let counter = 0;
        cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
            const rowtext = $row.text();
            if (rowtext.includes(prepareAppealData?.commentOpen)) {
                if (counter === 0) {
                    cy.wrap($row).within(() => {
                        cy.get('a').each(($link) => {
                            appealId = $link.attr('href')?.split('/').pop();
                            cy.log(appealId);
                            cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
                            return false;
                        });
                    });
                }
                counter++;
            }
        });
        basePage.verifyPageHeading('Appeal open for comment');
        cy.get(basePage?._selectors?.govukButton).contains(prepareAppealData?.commentOnThisAppealButton).click();
        //What is your name?
        cy.get(basePage?._selectors?.govukFieldsetHeading).contains('What is your name?');
        cy.advanceToNextPage();
        const nameErrorsList = [
            {
                key: '#first-name',
                value: 'Enter your first name'
            },
            {
                key: '#last-name',
                value: 'Enter your last name'
            }
        ];

        cy.get(basePage?._selectors.govukErrorSummaryList).find('a').each(($nameError, index) => {
            const nameErrorMap = nameErrorsList[index];
            cy.wrap($nameError)
                .should('have.attr', 'href', nameErrorMap.key) // Check for a specific attribute
                .and('contain.text', nameErrorMap.value); // Ensure the attribute is not empty
        });
        cy.get('#first-name').type('Test First Name');
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#last-name').and('contain.text', 'Enter your last name');
        cy.get('#last-name').type('Test Last Name');
        cy.advanceToNextPage();
        // address is empty
        cy.get('a[href="email-address"]').click();
        //  Email Address empty    
        cy.get('a[href="add-comments"]').click();
        basePage.verifyPageHeading('Add your comments');
        cy.advanceToNextPage();
        const commentErrorsList = [
            {
                key: '#comments',
                value: 'Enter your comments'
            },
            {
                key: '#comments-confirmation',
                value: 'Select that you have not included any sensitive information in your comments.'
            }
        ];

        cy.get(basePage?._selectors.govukErrorSummaryList).find('a').each(($commentError, index) => {
            const commentErrorMap = commentErrorsList[index];
            cy.wrap($commentError)
                .should('have.attr', 'href', commentErrorMap.key) // Check for a specific attribute
                .and('contain.text', commentErrorMap.value); // Ensure the attribute is not empty
        });
        cy.get('#comments').type('Interested Party comments with post code search');
        cy.advanceToNextPage();
        cy.get(basePage?._selectors.govukErrorSummaryList).find('a').should('have.attr', 'href', '#comments-confirmation').and('contain.text', 'Select that you have not included any sensitive information in your comments.');
        cy.get('#comments-confirmation').check();
        cy.advanceToNextPage();
        basePage.verifyPageHeading('Check your answers and submit your comments');
        const expectedRows = [
            {
                key: 'What is your name?',
                hrefContains: 'your-name'
            },
            {
                key: 'Address',
                hrefContains: 'enter-address'
            },
            {
                key: 'Email address',
                hrefContains: 'email-address'
            },
            {
                key: 'Your comments',
                hrefContains: 'add-comments'
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
            cy.wrap($row).find(basePage?._selectors.agovukLink).should('contain.text', 'Change').and('have.attr', 'href').then((href) => {
                expect(href).to.include(expected.hrefContains);
            });
        });
        cy.contains(basePage?._selectors?.govukButton, 'Submit comments').click();
    });
});