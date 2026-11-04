/// <reference types="cypress"/>
import { waitForPageElement } from '../../waitForPageElement';

export const appealIdWaitingForReview = () => {
    cy.get('#tab_waiting-for-review').click();
    const correlationId = Cypress.env('correlationId');
    const rowSelector = correlationId
        ? `[data-cy="submitted-appeal"][data-site-address-line-1="${correlationId}"]`
        : '#waiting-for-review tbody tr:last-child[data-cy="submitted-appeal"]';

    return waitForPageElement(rowSelector).then(($row) => ({
        caseRef: $row.attr('data-case-reference'),
        appealType: $row.attr('data-appeal-type')
    }));
};
