import { BasePage } from "../../../../page-objects/base-page";
export class GreenBeltPage {

    addGreenBeltData(appellantInGreenBelt) {
        const basePage = new BasePage();

        if (appellantInGreenBelt) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            //Is the appeal site in a green belt?Ans:No
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}