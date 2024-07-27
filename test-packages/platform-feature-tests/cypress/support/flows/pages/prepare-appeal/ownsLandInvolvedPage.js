import { BasePage } from "../../../../page-objects/base-page";
export class OwnsLandInvolvedPage {

    _selectors = {
        ownsLandInvolvedYes: '[data-cy="answer-yes"]',
        ownsLandInvolvedSome: '[data-cy="answer-some"]',
        ownsLandInvolvedNo: '[data-cy="answer-no"]'
    }

    addOwnsLandInvolvedData(knowsAllOwners) {
        const basePage = new BasePage();

        if (knowsAllOwners === 'yes') {
            basePage.clickRadioBtn(this._selectors?.ownsLandInvolvedYes);
            cy.advanceToNextPage();

            basePage.clickRadioBtn('[data-cy="answer-yes"]');
            cy.advanceToNextPage();
        } else {
            if (knowsAllOwners === 'some') {

                basePage.clickRadioBtn(this._selectors?.ownsLandInvolvedSome);
                cy.advanceToNextPage();

                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();

                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();

                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();

            } else if (knowsAllOwners === 'no') {

                basePage.clickRadioBtn(this._selectors?.ownsLandInvolvedNo);
                cy.advanceToNextPage();

                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();

                basePage.clickCheckBox('[data-cy="answer-yes"]');
                cy.advanceToNextPage();
            }
        }
    };
}