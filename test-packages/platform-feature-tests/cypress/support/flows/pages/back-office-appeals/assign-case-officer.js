// assign-case-officer.js
// This file is for Cypress E2E tests related to assigning a case officer in back-office appeals.

import { happyPathHelper } from "./happyPathHelper";

/**
 * Visits the appropriate application to assign a case officer.
 * Handles cross-origin errors for Microsoft login.
 * @param {'back-office'|'other-app'} app - The application to visit.
 */


export const assignCaseOfficer = (app = 'back-office', appealId) => {
    let baseUrl;
    if (app === 'back-office') {
        baseUrl = Cypress.config('back_office_base_url');
    } else if (app === 'other-app') {
        baseUrl = Cypress.config('other_app_base_url'); // Make sure this is set in your Cypress config
    } else {
        throw new Error(`Unknown app: ${app}`);
    }

    // If visiting a Microsoft login page, handle cross-origin errors
    //if (baseUrl.includes('login.microsoftonline.com')) {
    // cy.origin(`${baseUrl}/appeals-service/all-cases`, () => {
    //     cy.on('uncaught:exception', (e) => {
    //         // Suppress known CDN error
    //         if (e.message && e.message.includes('Failed to load external resource')) {
    //             return false;
    //         }
    //     });
    // });
    // }
    // cy.origin(baseUrl, () => {
    cy.visit(`${Cypress.config('back_office_base_url')}/appeals-service/all-cases`);
    //});
    cy.contains('Search all cases', { timeout: 10000 }).should('exist');
    happyPathHelper.assignCaseOfficer(appealId); // Example case ID, replace with actual case ID as needed
    //cy.login(user);
}