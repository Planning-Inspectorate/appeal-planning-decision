// @ts-nocheck
/// <reference types="cypress"/>
import { BasePage } from "../../../../page-objects/base-page";
export class SubmitDesignAccessStatementPage {
	addSubmitDesignAccessStatementData(context) {
		const basePage = new BasePage();
		if (context?.uploadDocuments?.isSubmitDesignAndAccessStmt) {
			//Did you submit a design and access statement with your application?
			cy.getByData(basePage?._selectors.answerYes).click();
			cy.advanceToNextPage();
			//Upload your design and access statement
			cy.uploadFileFromFixtureDirectory(context?.documents?.uploadDesignAndAccessStmt);
			cy.advanceToNextPage();
		} else {
			cy.getByData(basePage?._selectors.answerNo).click();
			cy.advanceToNextPage();
		}
		//Upload your plans, drawings and supporting documents you submitted with your application
		cy.uploadFileFromFixtureDirectory(context?.documents?.uploadPlansDrawingAndSupportingDocs);
		cy.advanceToNextPage();
	};
}