// repeatedly loads the url until the specified element is present
export const waitForPageElement = (selector) => {
	return cy.url().then((url) => {
		return cy.waitUntil(() => cy.request(url).then(({ body }) => {
			const document = new DOMParser().parseFromString(body, 'text/html');
			return document.querySelector(selector) !== null;
		}), {
			timeout: 30000,
			interval: 1000,
			errorMsg: `Waiting for ${selector} on ${url}`
		}).then(() => {
			cy.reload();
			return cy.get(selector).last().should('be.visible');
		});
	});
};
