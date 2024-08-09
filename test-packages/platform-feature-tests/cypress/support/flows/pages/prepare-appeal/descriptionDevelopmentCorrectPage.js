import { BasePage } from "../../../../page-objects/base-page";
export class DescriptionDevelopmentCorrectPage {

    _selectors = {
        updateDevelopmentDescription: '#updateDevelopmentDescription',
    }

    addDescriptionDevelopmentCorrectData() {
        const basePage = new BasePage();

        basePage.clickRadioBtn(this._selectors.updateDevelopmentDescription);
        cy.advanceToNextPage();
    };
}