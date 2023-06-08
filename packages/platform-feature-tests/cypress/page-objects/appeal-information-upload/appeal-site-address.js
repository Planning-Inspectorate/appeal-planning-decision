import { BasePage } from "../base-page"
import { TaskList } from "./task-list"

const basePage = new BasePage
const taskList = new TaskList

export class AppealSiteAddress {

    elements = {
        addressLineOneInput: () => cy.get('[data-cy="site-address-line-one"]'),
        addressLineTwoInput: () => cy.get('[data-cy="site-address-line-two"]'),
        townOrCityInput: () => cy.get('[data-cy="site-town-city"]'),
        countyInput: () => cy.get('[data-cy="site-county"]'),
        postcodeInput: () => cy.get('[data-cy="site-postcode"]')
    }
  
    enterAppealSiteAddress(){
        taskList.clickAppealSiteSectionLink();
        cy.url().should('include', 'appeal-site-address');
        this.elements.addressLineOneInput().clear().type('');
        this.elements.addressLineTwoInput().clear().type('');
        this.elements.townOrCityInput().clear().type('');
        this.elements.countyInput().clear().type('');
        this.elements.postcodeInput.clear().type('');
        basePage.clickSaveAndContiuneBtn();
    }
}