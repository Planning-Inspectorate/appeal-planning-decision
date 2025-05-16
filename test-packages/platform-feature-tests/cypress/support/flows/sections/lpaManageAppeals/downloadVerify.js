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
        cy.log(rowtext);
        if (rowtext.includes(lpaManageAppealsData?.decisionAllowed)) {
            if (counter === 0) {
                cy.log(rowtext);
                cy.wrap($row).within(() => {
                    cy.get('a').each(($link) => {
                        cy.log($link);
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
    cy.exec('del /q cypress\\downloads\\*');
    cy.window().then(win => {
        cy.stub(win, 'open').as('download')
    });
    cy.get(`a[href*="published-document"]`).invoke('text').then(filename => {
        cy.get(`a[href*="published-document"]`).click();
        cy.log(filename);
        cy.verifyDownload(filename, { contains: true });
    });
}

export const decisionAllowedInPartDowloadVerify = (lpaManageAppealsData) => {
    const basePage = new BasePage();
    cy.get(`a[href*="/manage-appeals/decided-appeals"]`).click();
    let counter = 0;
    cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
        const rowtext = $row.text();
        cy.log(rowtext);
        if (rowtext.includes(lpaManageAppealsData?.decisionAllowedInPart)) {
            if (counter === 0) {
                cy.log(rowtext);
                cy.wrap($row).within(() => {

                    cy.get('a').each(($link) => {
                        cy.log($link);
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
    cy.exec('del /q cypress\\downloads\\*');
    cy.window().then(win => {
        cy.stub(win, 'open').as('download')
    });
    cy.get(`a[href*="published-document"]`).invoke('text').then(filename => {
        cy.get(`a[href*="published-document"]`).click();
        cy.log(filename);
        cy.verifyDownload(filename, { contains: true });
    });

}


export const decisionDismissedVerification = (lpaManageAppealsData) => {
    const basePage = new BasePage();
    cy.get(`a[href*="/manage-appeals/decided-appeals"]`).click();
    let appealId;
    let counter = 0;
    cy.get(basePage?._selectors.trgovukTableRow).each(($row) => {
        const rowtext = $row.text();
        cy.log(rowtext);
        if (rowtext.includes(lpaManageAppealsData?.decisionDismissed)) {
            if (counter === 0) {
                cy.log(rowtext);
                cy.wrap($row).within(() => {

                    cy.get('a').each(($link) => {
                        cy.log($link);
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
