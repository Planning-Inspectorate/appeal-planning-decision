import { BasePage } from "../../../../page-objects/base-page";
const { OwnsRestOfLandPage } = require("./ownsRestOfLandPage");
const { OwnsLandInvolvedPage } = require("./ownsLandInvolvedPage")
const ownsRestOfLandPage = new OwnsRestOfLandPage();
const ownsLandInvolvedPage = new OwnsLandInvolvedPage();
export class OwnSomeLandPage {
    addOwnSomeLandData(isOwnsSomeLand, context) {
        const basePage = new BasePage();

        if (isOwnsSomeLand) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();

            ownsRestOfLandPage.addOwnsRestOfLandgData(context?.applicationForm?.knowsOtherOwners);
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();

            ownsLandInvolvedPage.addOwnsLandInvolvedData(context?.applicationForm?.knowsAllOwners);
        }
    };
}