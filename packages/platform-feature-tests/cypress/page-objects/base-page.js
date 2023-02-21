export class basePage {

    elements = {
        acceptCookiesBtn: () => cy.get('[data-cy="cookie-banner-accept-analytics-cookies"]'),
        declineCookiesBtn: () => cy.get('[data-cy="cookie-banner-reject-analytics-cookies"]'), 
        pageHeading: () => cy.get('.govuk-heading-l'),
        continueBtn: () => cy.get('[data-cy="start-button"]')
    }

    clickContiuneBtn(){
        this.elements.continueBtn().click();
    }

    acceptCookies(){
        this.elements.acceptCookiesBtn().click();
    }

    declineCookies(){
        this.elements.declineCookiesBtn().click();
    }

    verifyPageHeading(pageHeading){
        this.elements.pageHeading().contains(pageHeading);
    }
}

// module.exports = new basePage ();
