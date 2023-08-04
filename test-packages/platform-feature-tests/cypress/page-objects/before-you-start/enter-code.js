export class EnterFiveCode {
	elements = {
		EnterCodeField: () => cy.get('#email-code')
	}

	enterCode(fiveDigitCode) {
		this.elements.EnterCodeField().type(fiveDigitCode);
	}
}
