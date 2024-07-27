import { BasePage } from "../../../../page-objects/base-page";
export class OwnsRestOfLandPage {

    _selectors = {
        ownsRestOfLandYes: '[data-cy="answer-yes"]',
        ownsRestOfLandSome: '[data-cy="answer-some"]',
        ownsRestOfLandNo: '[data-cy="answer-no"]'
    }

    addOwnsRestOfLandgData(knowsOtherOwners) {
        const basePage = new BasePage();

        if (knowsOtherOwners === 'yes') {

            basePage.clickRadioBtn(this._selectors?.ownsRestOfLandYes);
            cy.advanceToNextPage();

            basePage.clickRadioBtn('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
        } else {
            if (knowsOtherOwners === 'some') {

                basePage.clickRadioBtn(this._selectors?.ownsRestOfLandSome);
                cy.advanceToNextPage();

                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();

                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();

                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();

            } else if (knowsOtherOwners === 'no') {

                basePage.clickRadioBtn(this._selectors?.ownsRestOfLandNo);
                cy.advanceToNextPage();

                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();

                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();
            }
        }
    };
}