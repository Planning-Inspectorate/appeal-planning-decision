export class ContactDetails{
    elements = {
        fullNameInputField: () => cy.get('#appellant-name'),
        companyNameInputField: () => cy.get('#appellant-company-name')
    }

    enterFullName(fullName){
        this.elements.fullNameInputField().type(fullName)
    }

    enterCompanyName(companyName){
        this.elements.companyNameInputField().type(companyName)
    }
}