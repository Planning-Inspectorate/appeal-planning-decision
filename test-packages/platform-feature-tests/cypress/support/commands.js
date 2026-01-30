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
	// Build as a pure Cypress chain to avoid returning native Promises
	return cy.request({
		method: 'GET',
		url: `${Cypress.config('apiBaseUrl')}appeals/case-reference/${caseObj}`,
		headers: {
			'Content-Type': 'application/json',
			azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		},
		failOnStatusCode: false
	}).then(({ status, body }) => {
		expect(status).to.eq(200);
		cy.log(`Loaded case details ${JSON.stringify(body)}`);
		const appealId = body.appealId;
		const appellantCaseId = body.appellantCaseId;
		return cy.request({
			method: 'PATCH',
			url: `${Cypress.config('apiBaseUrl')}appeals/${appealId}/appellant-cases/${appellantCaseId}`,
			headers: {
				'Content-Type': 'application/json',
				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
			},
			body: caseDetails,
			failOnStatusCode: false
		}).then(({ status, body }) => {
			expect(status).to.eq(200);
			return body;
		});
	});
});

Cypress.Commands.add('startAppeal', (caseObj) => {
	return appealsApiClient.startAppeal(caseObj).then(() => {
		
	});
});

Cypress.Commands.add('reviewLpaqSubmission', (caseObj) => {
	cy.log(`[reviewLpaqSubmission] Starting review for case ${caseObj}`);
	return appealsApiClient
		.reviewLpaq(caseObj)
		.then((body) => {
			cy.log(
				`[reviewLpaqSubmission] Success. validationOutcome: ${body?.validationOutcome?.name || 'unknown'}`
			);
			cy.log('Reviewed lpaq submission for case ref ' + caseObj);
		})
		.then(() => {
			return cy.reload();
		});
});

Cypress.Commands.add('reviewStatementViaApi', (caseObj) => {
	return appealsApiClient.reviewStatement(caseObj).then(() => {
		cy.log('Reviewed lpa statement for case ref ' + caseObj);
	});
});

Cypress.Commands.add('reviewIpCommentsViaApi', (caseObj) => {
	return appealsApiClient.reviewIpComments(caseObj).then(() => {
		cy.log('Reviewed IP comments for case ref ' + caseObj);
	});
});

Cypress.Commands.add('simulateStatementsDeadlineElapsed', (caseObj) => {
	return cy.wrap(null).then(async () => {
		await appealsApiClient.simulateStatementsElapsed(caseObj);
		return;
	});
});

Cypress.Commands.add('shareCommentsAndStatementsViaApi', (caseObj) => {
	return cy.wrap(null).then(async () => {
		await appealsApiClient.shareCommentsAndStatements(caseObj);
		cy.log('Shared IP Comments and Statements for case ref ' + caseObj);
		return;
	});
});

Cypress.Commands.add('reviewLpaFinalCommentsViaApi', (caseObj) => {
	return cy.wrap(null).then(async () => {
		await appealsApiClient.reviewLpaFinalComments(caseObj);
		cy.log('Reviewed LPA final comments for case ref ' + caseObj);
		return;
	});
});

Cypress.Commands.add('reviewAppellantFinalCommentsViaApi', (caseObj) => {
	return cy.wrap(null).then(async () => {
		await appealsApiClient.reviewAppellantFinalComments(caseObj);
		cy.log('Reviewed appellant final comments for case ref ' + caseObj);
		return;
	});
});

Cypress.Commands.add('simulateFinalCommentsDeadlineElapsed', (caseObj) => {
	return cy.wrap(null).then(async () => {
		await appealsApiClient.simulateFinalCommentsElapsed(caseObj);
		cy.log('Simulated site visit elapsed for case ref ' + caseObj);
		return;
	});
});

Cypress.Commands.add('setupSiteVisitViaAPI', (caseObj) => {
	return cy.wrap(null).then(async () => {
		await appealsApiClient.setupSiteVisit(caseObj);
		cy.log('Setup site visit for case ref ' + caseObj);
		return;
	});
});

Cypress.Commands.add('simulateSiteVisit', (caseObj) => {
	return cy.wrap(null).then(async () => {
		await appealsApiClient.simulateSiteVisitElapsed(caseObj);
		cy.log('Simulated site visit elapsed for case ref ' + caseObj);
		return;
	});
});

Cypress.Commands.add('issueDecisionViaApi', (caseObj) => {
	return cy.wrap(null).then(async () => {
		await appealsApiClient.issueDecision(caseObj);
		cy.log('Issue allowed decision for case ref ' + caseObj);
		cy.reload();
	});
});
