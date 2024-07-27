import { BasePage } from "../../../../page-objects/base-page";
export class SubmitDesignAccessStatementPage {
	addSubmitDesignAccessStatementData(context) {
		const basePage = new BasePage();
		if (context?.uploadDocuments?.isSubmitDesignAndAccessStmt) {
			//Did you submit a design and access statement with your application?
			basePage.clickRadioBtn('[data-cy="answer-yes"]');
			cy.advanceToNextPage();
			//Upload your design and access statement
			cy.uploadFileFromFixtureDirectory(context?.documents?.uploadDesignAndAccessStmt);
			cy.advanceToNextPage();
		} else {
			basePage.clickRadioBtn('[data-cy="answer-no"]');
			cy.advanceToNextPage();
		}
		//Upload your plans, drawings and supporting documents you submitted with your application
		cy.uploadFileFromFixtureDirectory(context?.documents?.uploadPlansDrawingAndSupportingDocs);
		cy.advanceToNextPage();
	};
}