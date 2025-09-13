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
    // cy.visit(`${Cypress.config('back_office_base_url')}/appeals-service/all-cases`);
    //});

    // cy.visit(baseUrl + '/appeals-service/all-cases') may redirect to login; handle both cases
    const targetUrl = `${Cypress.config('back_office_base_url')}/appeals-service/all-cases`;

    const MAX_ATTEMPTS = 3;

    function checkPage(attempt = 1) {
        cy.log(`Checking back-office all-cases page (attempt ${attempt}/${MAX_ATTEMPTS})`);
        cy.visit(targetUrl, { failOnStatusCode: false });
        // Wait briefly for client-side rendering
        cy.wait(1000);

        cy.document().then((doc) => {
            const hasSearchText = doc.querySelector('a, button, h1, h2, label')
                && Array.from(doc.querySelectorAll('a, button, h1, h2, label')).some(el => /search all cases/i.test(el.textContent || ''));
            const hasSearchInput = !!doc.querySelector('input[placeholder*="Search all cases" i], input[aria-label*="Search all cases" i], input[name*="search" i]');
            const isLoginPage = (doc.location && /login.microsoftonline.com|signin/.test(doc.location.href)) || !!doc.querySelector('input[name="loginfmt"], input[type="email"], form[action*="login.microsoftonline"]');

            if (hasSearchText || hasSearchInput) {
                // Prefer a Cypress assertion for the visible element so it retries until visible
                cy.contains(/Search all cases/i, { timeout: 20000 }).should('exist').then(() => {
                    happyPathHelper.assignCaseOfficer(appealId);
                });
                return;
            }

            if (isLoginPage) {
                cy.log('Redirected to login page when opening back-office. Authentication is required.');
                cy.screenshot('assign-case-officer-redirected-to-login');
                throw new Error('Redirected to login page when opening back-office. Ensure test user is authenticated or set cookies before this step.');
            }

            // If we reached here, nothing matched. Retry up to MAX_ATTEMPTS.
            const anchors = Array.from(doc.querySelectorAll('a')).map(a => `${(a.textContent||'').trim()} -> ${a.getAttribute('href')}`);
            cy.log('Anchors on page:', JSON.stringify(anchors));
            cy.screenshot(`assign-case-officer-search-missing-attempt-${attempt}`);

            if (attempt < MAX_ATTEMPTS) {
                cy.log(`Search UI not found, retrying (${attempt + 1}/${MAX_ATTEMPTS})`);
                cy.wait(2000);
                checkPage(attempt + 1);
            } else {
                // Final failure: capture full HTML for diagnostics and fail
                cy.document().then((d) => {
                    const html = d.documentElement.outerHTML;
                    // Write debug HTML to disk if file writing task is available
                    try {
                        // avoid failing if task is not registered
                        // eslint-disable-next-line no-undef
                        cy.task('writeFile', { path: 'cypress/debug/assign-case-officer-page.html', contents: html }).then(() => {
                            cy.log('Wrote debug HTML to cypress/debug/assign-case-officer-page.html');
                        }).catch(() => {});
                    } catch (e) {
                        // ignore
                    }
                }).then(() => {
                    throw new Error('Expected search UI not found on back-office all-cases page after multiple attempts. See screenshots and logs for details.');
                });
            }
        });
    }

    checkPage();
    //cy.contains('Search all cases', { timeout: 10000 }).should('exist');
    //happyPathHelper.assignCaseOfficer(appealId); // Example case ID, replace with actual case ID as needed
    //cy.login(user);
 }