// @ts-nocheck
/// <reference types="cypress"/>
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { BrowserAuthData } from '../fixtures/browser-auth-data';
import { appealsApiClient } from './appealsApiClient';
const cookiesToSet = ['domain', 'expiry', 'httpOnly', 'path', 'secure'];

Cypress.Commands.add('advanceToNextPage', (text = 'Continue') => {
	cy.get('.govuk-button').contains(text).click();
});

Cypress.Commands.add('getByData', (value) => {
	return cy.get(`[data-cy="${value}"]`);
});

Cypress.Commands.add('getById', (value) => {
	return cy.get(`#${value}`);
});

Cypress.Commands.add('shouldHaveErrorMessage', (selector, message) => {
	return cy.get(selector).should('have.text', message);
});

Cypress.Commands.add('containsMessage', (selector, message) => {
	cy.get(selector).contains(message);
});



// Cypress.Commands.add('goToAppealSection', (sectionName) => {
// 	//cy.get('.moj-task-list__task-name').contains(sectionName).click();
// 	//cy.get('.govuk-visually-hidden').contains(sectionName).click();
// 	cy.get('govuk-visually-hidden').contains(sectionName).click();
// });

// Cypress.Commands.add('goToAppealSection', (sectionName) => {
// 	cy.get('.govuk-visually-hidden').each(($el)=>{
// 		if($el.text().trim === sectionName){
// 			cy.wrap($el).click()
// 			return false
// 		}
// });
// });

Cypress.Commands.add('taskListComponent', (applicationType, answerType, dynamicId) => {
	cy.get(`a[href*="/appeals/${applicationType}/prepare-appeal/${answerType}?id=${dynamicId}"]`).click();
});



Cypress.Commands.add('validateURL', (expectedUrl) => {
	cy.url().then(currentUrl => {
		const normalize = (s = '') => s.replace(/^https?:\/\//, '').replace(/\/+$/, '');
		const curr = normalize(currentUrl);
		const exp = normalize(expectedUrl);
		expect(curr).to.include(exp);
	});
});

// New helper: wait for an element to be visible and enabled before typing
Cypress.Commands.add('typeWhenEnabled', (selector, text, options = {}) => {
	// Accept either a selector string or a jQuery element wrapped by cy.get
	if (typeof selector === 'string') {
		return cy.get(selector, { timeout: options.timeout ?? 20000 })
			.should('be.visible')
			.should('not.be.disabled')
			.then(($el) => {
				cy.wrap($el).clear();
				cy.wrap($el).type(text, options);
			});
	}

	// If the caller passed an element (subject) we wrap and act on it
	return cy.wrap(selector)
		.should('be.visible')
		.should('not.be.disabled')
		.then(($el) => {
			cy.wrap($el).clear();
			cy.wrap($el).type(text, options);
		});
});


Cypress.Commands.add('goToAppealSection', (sectionName) => {
	cy.get('.govuk-visually-hidden').each(($el) => {
		if ($el.text().trim === sectionName) {
			cy.wrap($el).click()
			return false
		}
	});
});

Cypress.Commands.add('uploadDocuments', (applicationType, uploadType, dynamicId) => {
	// BEWARE! If you use `cy.fixtures()` instead, its caching will cause
	// issues on tests that use the same fixtures as ones run before!!
	//href="/appeals/householder/upload-documents/upload-application-form?
	cy.get(`a[href*="/appeals/${applicationType}/upload-documents/${uploadType}?id=${dynamicId}"]`
	).click();
});

Cypress.Commands.add('uploadFileFromFixturesDirectory', (filename) => {
	// BEWARE! If you use `cy.fixtures()` instead, its caching will cause
	// issues on tests that use the same fixtures as ones run before!!

	cy.get('#file-upload').selectFile(`cypress/fixtures/${filename}`);
});

Cypress.Commands.add('uploadFileFromFixtureDirectories', (filename) => {
	// BEWARE! If you use `cy.fixtures()` instead, its caching will cause
	// issues on tests that use the same fixtures as ones run before!!
	cy.get('input[type="file"]').then($input => {
		$input.removeAttr('hidden');
	})
	cy.get('input[type="file"]').selectFile(`cypress/fixtures/${filename}`, { force: true });
});
Cypress.Commands.add('uploadFileFromFixtureDirectory', (filename) => {
	// BEWARE! If you use `cy.fixtures()` instead, its caching will cause
	// issues on tests that use the same fixtures as ones run before!!
	cy.get('input[type="file"]').then($input => {
		$input.removeAttr('hidden');
	});
	cy.get('input[type="file"]').selectFile(`cypress/fixtures/${filename}`, { force: true });
});


Cypress.Commands.add('checkIfUnchecked', (labelText) => {
	cy.contains('label', labelText).invoke('attr', 'for').then((id) => {
		cy.get(`#${id}`).then($checkbox => {
			if (!$checkbox.is(':checked')) {
				cy.wrap($checkbox).click();
			}
			else {
				cy.log(`Checkbox"${labelText}"is already checkDebugAllowed. Skipping.`);
			}
		});
	});
});

export function setLocalCookies(userId) {
	cy.log(userId);
	cy.readFile(
		`${BrowserAuthData.BrowserAuthDataFolder}/${userId}-${BrowserAuthData.CookiesFile}`
	).then((data) => {
		cy.clearCookies();
		data.forEach((cookie) => {
			cy.setCookie(cookie.name, cookie.value, {
				domain: cookie.domain,
				expiry: cookie.expires,
				httpOnly: cookie.httpOnly,
				path: cookie.path,
				secure: cookie.secure,
				log: false
			});
			if (cookiesToSet.includes(cookie.name)) {
				cy.getCookie(cookie.name).should('not.be.empty');
			}
		});
	});
}

Cypress.Commands.add('setCurrentCookies', (cookies) => {
	cy.clearCookies();
	cookies.forEach((cookie) => {
		cy.setCookie(cookie.name, cookie.value, {
			domain: cookie.domain,
			expiry: cookie.expiry,
			httpOnly: cookie.httpOnly,
			path: cookie.path,
			secure: cookie.secure
		});
		Cypress.Cookies.preserveOnce(cookie.name);
	});
});

Cypress.Commands.add('login', (user) => {
	//cy.clearCookies();
	cy.task('CookiesFileExists', user.id).then((exists) => {
		if (!exists) {
			cy.log(`No cookies 🍪 found!\nLogging in as: ${user.id}`);
			cy.loginWithPuppeteer(user);
		} else {
			cy.log(`Found some cookies! 🍪\nSetting cookies for: ${user.id}`);
			setLocalCookies(user.id);
		}
	});
});

Cypress.Commands.add('clearCookiesFiles', () => {
	cy.task('ClearAllCookies').then((cleared) => {
		console.log(cleared);
	});
});

Cypress.Commands.add('loginWithPuppeteer', (user) => {
	var config = {
		username: user.email,
		password: Cypress.env('AUTH_PASSWORD'),
		loginUrl: Cypress.config('appeals_beta_base_url'),
		id: user.id
	};

	cy.task('AzureSignIn', config).then((cookies) => {
		cy.clearCookies();
		cookies.forEach((cookie) => {
			cy.setCookie(cookie.name, cookie.value, {
				domain: cookie.domain,
				expiry: cookie.expires,
				httpOnly: cookie.httpOnly,
				path: cookie.path,
				secure: cookie.secure,
				log: false
			});
			if (cookiesToSet.includes(cookie.name)) {
				cy.log('cookie name');
				cy.getCookie(cookie.name).should('not.be.empty');
			}
		});
	});
	return
});

Cypress.Commands.add('getBusinessActualDate', (date, days) => {
	return cy.wrap(null).then(() => {
		const formattedDate = new Date(date).toISOString();
		return appealsApiClient.getBusinessDate(formattedDate, days).then((result) => {
			return new Date(result);
		});
	});
});

Cypress.Commands.add('updateAppealDetailsViaApi', (caseObj, caseDetails) => {
	return cy.wrap(null).then(async () => {
		const details = await appealsApiClient.loadCaseDetails(caseObj);
		const appealId = details.appealId;
		const appellantCaseId = details.appellantCaseId;
		return await appealsApiClient.updateAppealCases(appealId, appellantCaseId, caseDetails);
	});
});

Cypress.Commands.add('startAppeal', (caseObj) => {
	return cy.wrap(null).then(async () => {
		await appealsApiClient.startAppeal(caseObj);
		cy.log('Started case for ref ' + caseObj);
		return;
	});
});

Cypress.Commands.add('reviewLpaqSubmission', (caseObj) => {
	return cy.wrap(null).then(async () => {
		await appealsApiClient.reviewLpaq(caseObj);
		cy.log('Reviewed lpaq submission for case ref ' + caseObj);
		return;
	});
});

Cypress.Commands.add('reviewStatementViaApi', (caseObj) => {
	return cy.wrap(null).then(async () => {
		await appealsApiClient.reviewStatement(caseObj.reference);
		cy.log('Reviewed lpa statement for case ref ' + caseObj.reference);
		return;
	});
});

Cypress.Commands.add('reviewIpCommentsViaApi', (caseObj) => {
	return cy.wrap(null).then(async () => {
		await appealsApiClient.reviewIpComments(caseObj.reference);
		cy.log('Reviewed IP comments for case ref ' + caseObj.reference);
		return;
	});
});
