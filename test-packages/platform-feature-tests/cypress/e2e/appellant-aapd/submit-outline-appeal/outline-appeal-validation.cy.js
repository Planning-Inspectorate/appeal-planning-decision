// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../page-objects/base-page";
import { PrepareAppealSelector } from "../../../page-objects/prepare-appeal/prepare-appeal-selector";
import { users } from "../../../fixtures/users.js";

describe("Outline Planning Appeal Validation", { tags: "@outline-planning-validation" }, () => {
	const basePage = new BasePage();
	const prepareAppealSelector = new PrepareAppealSelector();

	before(() => {
		cy.login(users.appeals.authUser);
	});

	it("selects outline planning and continues to the application details", () => {
		cy.visit(`${Cypress.config("appeals_beta_base_url")}/before-you-start`);
		cy.advanceToNextPage();
		cy.get(basePage?._selectors?.localPlanningDepartment)
			.type(prepareAppealSelector?._selectors?.systemTest2BoroughCouncil);
		cy.get(basePage?._selectors?.localPlanningDepartmentOptionZero).click();
		cy.advanceToNextPage();

		cy.getByData(prepareAppealSelector?._selectors?.answerOutlinePlanning)
			.click()
			.should("be.checked");
		cy.advanceToNextPage();
		cy.url().should("match", /before-you-start\/(application-date|granted-or-refused)/);
	});
});