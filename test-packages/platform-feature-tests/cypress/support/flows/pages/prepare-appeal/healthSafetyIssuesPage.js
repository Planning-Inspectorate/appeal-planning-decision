module.exports = (context) => {

    if (context?.applicationForm?.isAppellantSiteSafety) {
        cy.get('[data-cy="answer-yes"]').click();
        cy.get('#appellantSiteSafety_appellantSiteSafetyDetails').type('appellantSiteSafety_appellantSiteSafetyDetails1234567890!"£$%^&*(10)');
        cy.advanceToNextPage();
    }
    else {
        cy.get('[data-cy="answer-no"]').click();
        cy.advanceToNextPage();
    }
};