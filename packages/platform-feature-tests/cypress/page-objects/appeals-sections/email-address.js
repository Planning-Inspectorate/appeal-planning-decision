import { BasePage } from "../base-page";

export class EmailAddressInput extends BasePage {
    elements = {
        emailAddressField: () => cy.get('[data-cy="email-address"]')
    }

    enterEmailAddress(emailAddress){
        this.elements.emailAddressField().type(emailAddress)
    }
}