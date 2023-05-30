export class AppealSiteAddress {
    elements = {
        addressLineOneInput: () => cy.get('[data-cy="site-address-line-one"]'),
        addressLineTwoInput: () => cy.get('[data-cy="site-address-line-two"]'),
        townOrCityInput: () => cy.get('[data-cy="site-town-city"]'),
        countyInput: () => cy.get('[data-cy="site-county"]'),
        postcodeInput: () => cy.get('[data-cy="site-postcode"]')
    }

    inputAddressLineOne(address){
        this.elements.addressLineOneInput().clear().type(address)
    }

    inputAddressLineTwo(address){
        this.elements.addressLineTwoInput().clear().type(address)
    }

    inputTownOrCity(townCity){
        this.elements.townOrCityInput().clear().type(townCity)
    }

    inputCounty(county){
        this.elements.countyInput().clear().type(county)
    }

    inputPostCode(postcode){
        this.elements.postcodeInput().clear().type(postcode)
    }

}