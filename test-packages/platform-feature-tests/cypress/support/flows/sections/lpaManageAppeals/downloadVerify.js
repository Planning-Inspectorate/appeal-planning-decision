/* eslint-disable cypress/unsafe-to-chain-command */
// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";

export const decisionAllowedDowloadVerify = (lpaManageAppealsData) => {
    const basePage = new BasePage();
    cy.get(`a[href*="/manage-appeals/decided-appeals"]`).click();
    let counter = 0;
    cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
        const rowtext = $row.text();
        if (rowtext.includes(lpaManageAppealsData?.decisionAllowed)) {
            if (counter === 0) {
                cy.wrap($row).within(() => {
                    cy.get('a').each(($link) => {
                        if ($link.attr('href')?.includes(`/manage-appeals/`)) {
                            cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
                            return false;
                        }
                    });
                });
            }
            counter++;
        }
    }).then(() => {
    });
    cy.task('deleteFolder', 'cypress/downloads');
    cy.window().then(win => {
        cy.stub(win, 'open').as('download')
    });
    cy.get('a[href*="published-document"]').then(($links) => {
        cy.wrap($links).each(($link) => {
            // get filename from link text (not href)
            cy.wrap($link).invoke('text').then((filename) => {              

                // click the link
                cy.wrap($link).click({ force: true });

                // verify the download
                cy.verifyDownload(filename.trim(), { contains: true });
            });
        });
    });
}


export const decisionAllowedInPartDowloadVerify = (lpaManageAppealsData) => {
    const basePage = new BasePage();
    cy.get(`a[href*="/manage-appeals/decided-appeals"]`).click();
    let counter = 0;
    cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
        const rowtext = $row.text();
        if (rowtext.includes(lpaManageAppealsData?.decisionAllowedInPart)) {
            if (counter === 0) {
                cy.wrap($row).within(() => {

                    cy.get('a').each(($link) => {
                        if ($link.attr('href')?.includes(`/manage-appeals/`)) {
                            cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
                            return false;
                        }
                    });
                });
            }
            counter++;
        }
    }).then(() => {
    });
    cy.task('deleteFolder', 'cypress/downloads');
    cy.window().then(win => {
        cy.stub(win, 'open').as('download')
    });

    cy.get('a[href*="published-document"]').then(($links) => {
        cy.wrap($links).each(($link) => {
            // get filename from link text (not href)
            cy.wrap($link).invoke('text').then((filename) => {            

                // click the link
                cy.wrap($link).click({ force: true });

                // verify the download
                cy.verifyDownload(filename.trim(), { contains: true });
            });
        });
    });
}


export const decisionDismissedVerification = (lpaManageAppealsData) => {
    const basePage = new BasePage();
    cy.get(`a[href*="/manage-appeals/decided-appeals"]`).click();
    let appealId;
    let counter = 0;
    cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
        const rowtext = $row.text();
        if (rowtext.includes(lpaManageAppealsData?.decisionDismissed)) {
            if (counter === 0) {
                cy.wrap($row).within(() => {
                    cy.get('a').each(($link) => {
                        if ($link.attr('href')?.includes(`/manage-appeals/`)) {
                            appealId = $link.attr('href')?.split('/').pop();
                            cy.wrap($link).scrollIntoView().should('be.visible').click({ force: true });
                            return false;
                        }
                    });
                });
            }
            counter++;
        }
    }).then(() => {
        cy.validateURL(`/manage-appeals/${appealId}`);
    });
}
