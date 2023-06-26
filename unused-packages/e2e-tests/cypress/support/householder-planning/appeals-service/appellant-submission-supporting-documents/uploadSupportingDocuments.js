import 'cypress-file-upload';

export const uploadSupportingDocuments = (paths) => {
	if (!Array.isArray(paths)) {
		paths = [paths];
	}

	paths.forEach((path) =>
		cy.get('#supporting-documents').attachFile({ filePath: path, encoding: 'binary' })
	);

	cy.wait(Cypress.env('demoDelay'));
};
