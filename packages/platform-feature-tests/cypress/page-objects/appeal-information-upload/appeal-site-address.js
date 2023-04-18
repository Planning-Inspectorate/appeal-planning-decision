export class AppealSiteAddress{
    elements = {
        addressLineOneInput: () => cy.get('[data-cy="site-address-line-one"]'),
        addressLineTwoInput: () => cy.get('[data-cy="site-address-line-two"]'),
        townOrCityInput: () => cy.get('[data-cy="site-town-city"]'),
        countyInput: () => cy.get('[data-cy="site-county"]'),
        postcodeInput: () => cy.get('[data-cy="site-postcode"]')
    }
}