import { BasePage } from "../../../../page-objects/base-page";
export class OwnAllLandPage {
    addOwnAllLandData(isOwnsAllLand) {
        const basePage = new BasePage();

        if (isOwnsAllLand) {
            //Do you own all the land involved in the appeal?Ans:yes
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();

        } else {
            //Do you own all the land involved in the appeal?Ans:No
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}