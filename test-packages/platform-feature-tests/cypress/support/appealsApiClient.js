// @ts-nocheck
//import { appealsApiRequests, documentsApiRequest } from '../fixtures/appealsApiRequests';
//import { apiPaths } from './apiPaths.js';

const baseUrl = Cypress.config('apiBaseUrl');

// export const createApiSubmission = (submission, type) => {
// 	const env = baseUrl.indexOf('test') > -1 ? 'test' : 'dev';

// 	return {
// 		...submission,
// 		...documentsApiRequest[env][type]
// 	};
// };

export const appealsApiClient = {
	// async caseSubmission(requestBody) {
	// 	try {
	// 		const submission = createApiSubmission(appealsApiRequests.caseSubmission, 'appellant');
	// 		const { casedata, users, documents } = submission;

	// 		console.log({
	// 			...casedata,
	// 			...requestBody
	// 		});

	// 		const url = baseUrl + apiPaths.caseSubmission;
	// 		const response = await fetch(url, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: JSON.stringify({
	// 				casedata: {
	// 					...casedata,
	// 					...requestBody
	// 				},
	// 				users,
	// 				documents
	// 			})
	// 		});

	// 		if (!response.ok) {
	// 			const errorBody = await response.text();
	// 			throw new Error(`HTTP error calling: ${url} with status: ${response.status}`, errorBody);
	// 		}

	// 		const data = await response.json();
	// 		return {
	// 			reference: data.reference,
	// 			id: data.id
	// 		};
	// 	} catch (error) {
	// 		console.error('Error making API call:', error);
	// 		throw error;
	// 	}
	// },
	// async lpqaSubmission(reference) {
	// 	try {
	// 		const requestBody = createApiSubmission(appealsApiRequests.lpaqSubmission, 'lpaq');
	// 		requestBody.casedata.caseReference = reference;

	// 		const url = baseUrl + apiPaths.lpqaSubmission;
	// 		const response = await fetch(url, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json'
	// 			},
	// 			body: JSON.stringify(requestBody)
	// 		});

	// 		if (!response.ok) {
	// 			const errorBody = await response.text();
	// 			throw new Error(`HTTP error calling: ${url} with status: ${response.status}`, errorBody);
	// 		}

	// 		const data = await response.json();
	// 		return data.reference;
	// 	} catch (error) {
	// 		console.error('Error making API call:', error);
	// 		throw error;
	// 	}
	// },
	// async addRepresentation(reference, type, serviceUserId, representation) {
	// 	const submission = createApiSubmission(appealsApiRequests[type], type);
	// 	submission.caseReference = reference;
	// 	if (serviceUserId !== null) {
	// 		submission.serviceUserId = serviceUserId;
	// 	}
	// 	if (representation !== null) {
	// 		submission.representation = representation;
	// 	}
	// 	try {
	// 		const url = baseUrl + apiPaths.repSubmission;
	// 		const response = await fetch(url, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			},
	// 			body: JSON.stringify(submission)
	// 		});

	// 		return await response.json();
	// 	} catch {
	// 		return false;
	// 	}
	// },
	async simulateSiteVisitElapsed(reference) {
		try {
			const url = `${baseUrl}appeals/${reference}/site-visit-elapsed`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
				}
			});
			expect(response.status).eq(200);
			return await response.json();
		} catch {
			return false;
		}
	},

	// async simulateHearingElapsed(reference) {
	// 	try {
	// 		const url = `${baseUrl}appeals/${reference}/hearing-elapsed`;
	// 		const response = await fetch(url, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			}
	// 		});

	// 		expect(response.status).eq(200);
	// 		return await response.json();
	// 	} catch {
	// 		return false;
	// 	}
	// },

	async simulateStatementsElapsed(reference) {
		try {
			const url = `${baseUrl}appeals/${reference}/statements-elapsed`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
				}
			});

			const result = await response.json();
			return result;
		} catch {
			return false;
		}
	},
	async simulateFinalCommentsElapsed(reference) {
		try {
			const url = `${baseUrl}appeals/${reference}/final-comments-elapsed`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
				}
			});

			const result = await response.json();
			return result;
		} catch {
			return false;
		}
	},
	async loadCaseDetails(reference) {
		// Use Cypress request so the test runner controls timing/cleanup
		return cy.request({
			method: 'GET',
			url: `${baseUrl}appeals/case-reference/${reference}`,
			headers: {
				'Content-Type': 'application/json',
				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
			},
			failOnStatusCode: false
		}).then(({ status, body }) => {
			expect(status).to.eq(200);
			return body;
		});
	},
	getBusinessDate(date, days = 7) {
		return cy.request({
			method: 'POST',
			url: `${baseUrl}appeals/add-business-days`,
			headers: {
				'Content-Type': 'application/json'
			},
			body: {
				inputDate: date,
				numDays: days
			},
			failOnStatusCode: false
		}).then(({ status, body }) => {
			expect(status).to.eq(200);
			return body;
		});
	},
	// async getSpecialisms() {
	// 	try {
	// 		const url = `${baseUrl}appeals/appeal-allocation-specialisms`;
	// 		const response = await fetch(url, {
	// 			method: 'GET',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			}
	// 		});
	// 		expect(response.status).eq(200);
	// 		return await response.json();
	// 	} catch {
	// 		return false;
	// 	}
	// },
	// async updateAllocation(appealId, specialismsIds) {
	// 	try {
	// 		const requestBody = createApiSubmission(
	// 			appealsApiRequests['allocationLevelAndSpecialisms'],
	// 			null
	// 		);
	// 		requestBody.specialisms = specialismsIds;
	// 		const url = `${baseUrl}appeals/${appealId}/appeal-allocation`;
	// 		const response = await fetch(url, {
	// 			method: 'PATCH',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			},
	// 			body: JSON.stringify({
	// 				level: 'A',
	// 				specialisms: specialismsIds
	// 			})
	// 		});
	// 		expect(response.status).eq(200);
	// 		return await response.json();
	// 	} catch {
	// 		return false;
	// 	}
	// },

	// async addHearing(appealId, date) {
	// 	try {
	// 		const requestBody = createApiSubmission(appealsApiRequests.hearingDetails);
	// 		requestBody.hearingStartTime = date.toISOString();
	// 		requestBody.hearingEndTime = date.toISOString();
	// 		const url = `${baseUrl}appeals/${appealId}/hearing`;
	// 		const response = await fetch(url, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			},
	// 			body: JSON.stringify(requestBody)
	// 		});

	// 		expect(response.status).eq(201);
	// 		return await response.json();
	// 	} catch {
	// 		return false;
	// 	}
	// },

	// async deleteHearing(appealId, hearingId) {
	// 	try {
	// 		const url = `${baseUrl}appeals/${appealId}/hearing/${hearingId}`;
	// 		const response = await fetch(url, {
	// 			method: 'DELETE',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			}
	// 		});
	// 		expect(response.status).eq(200);
	// 		return await response.json();
	// 	} catch {
	// 		return false;
	// 	}
	// },

	// async getNotifyEmails(reference) {
	// 	try {
	// 		const url = `${baseUrl}appeals/${reference}/notify-emails-sent`;
	// 		const response = await fetch(url, {
	// 			method: 'GET',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			}
	// 		});
	// 		expect(response.status).to.eq(200);
	// 		return await response.json();
	// 	} catch {
	// 		return false;
	// 	}
	// },

	updateAppealCases(appealId, appellantCaseId, requestBody) {
		return cy.request({
			method: 'PATCH',
			url: `${baseUrl}appeals/${appealId}/appellant-cases/${appellantCaseId}`,
			headers: {
				'Content-Type': 'application/json',
				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
			},
			body: requestBody,
			failOnStatusCode: false
		}).then(({ status, body }) => {
			expect(status).to.eq(200);
			return body;
		});
	},

	// async updateTimeTable(appealId, timeTableId, requestBody) {
	// 	try {
	// 		const url = `${baseUrl}appeals/${appealId}/appeal-timetables/${timeTableId}`;
	// 		const response = await fetch(url, {
	// 			method: 'PATCH',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			},
	// 			body: JSON.stringify(requestBody)
	// 		});
	// 		expect(response.status).eq(200);
	// 		return await response.json();
	// 	} catch {
	// 		return false;
	// 	}
	// },

	// async addInquiry(appealId, date, propertyOverrides) {
	// 	try {
	// 		const requestBody = createApiSubmission(appealsApiRequests.inquiryDetails);
	// 		requestBody.inquiryStartTime = date.toISOString();
	// 		requestBody.inquiryEndTime = date.toISOString();
	// 		requestBody.startDate = date.toISOString();
	// 		requestBody.lpaQuestionnaireDueDate = date.toISOString();
	// 		requestBody.statementDueDate = date.toISOString();
	// 		requestBody.ipCommentsDueDate = date.toISOString();
	// 		requestBody.statementOfCommonGroundDueDate = date.toISOString();
	// 		requestBody.proofOfEvidenceAndWitnessesDueDate = date.toISOString();
	// 		requestBody.planningObligationDueDate = date.toISOString();
	// 		requestBody.isStartCase = true;

	// 		// apply any overrides to payload
	// 		const requestBodyWithOverrides = {
	// 			...requestBody,
	// 			...propertyOverrides
	// 		};

	// 		cy.log(`** requestBodyWithOverrides - `, JSON.stringify(requestBodyWithOverrides));

	// 		const url = `${baseUrl}appeals/${appealId}/inquiry`;
	// 		const response = await fetch(url, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			},
	// 			body: JSON.stringify(requestBodyWithOverrides)
	// 		});

	// 		expect(response.status).eq(201);
	// 		return await response.json();
	// 	} catch {
	// 		return false;
	// 	}
	// },

	reviewStatement(reference) {
		return cy.request({
			method: 'POST',
			url: `${baseUrl}appeals/${reference}/review-lpa-statement`,
			headers: {
				'Content-Type': 'application/json',
				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
			},
			failOnStatusCode: false
		}).then(({ status }) => {
			expect(status).to.eq(200);
			return true;
		});
	},

	reviewIpComments(reference) {
		return cy.request({
			method: 'POST',
			url: `${baseUrl}appeals/${reference}/review-ip-comment`,
			headers: {
				'Content-Type': 'application/json',
				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
			},
			failOnStatusCode: false
		}).then(({ status }) => {
			expect(status).to.eq(200);
			return true;
		});
	},
	async shareCommentsAndStatements(reference) {
		try {
			const url = `${baseUrl}appeals/${reference}/share-comments-and-statement`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
				}
			});
			expect(response.status).eq(200);
		} catch {
			return false;
		}
	},

	async reviewAppellantFinalComments(reference) {
		try {
			const url = `${baseUrl}appeals/${reference}/review-appellant-final-comments`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
				}
			});
			expect(response.status).eq(200);
		} catch {
			return false;
		}
	},

	async reviewLpaFinalComments(reference) {
		try {
			const url = `${baseUrl}appeals/${reference}/review-lpa-final-comments`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
				}
			});
			expect(response.status).eq(200);
		} catch {
			return false;
		}
	},

	async setupSiteVisit(reference) {
		try {
			const url = `${baseUrl}appeals/${reference}/set-up-site-visit`;
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
				}
			});
			expect(response.status).eq(201);
		} catch {
			return false;
		}
	},

	// async issueDecision(reference) {
	// 	try {
	// 		const url = `${baseUrl}appeals/${reference}/issue-decision`;
	// 		const response = await fetch(url, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			}
	// 		});
	// 		expect(response.status).eq(201);
	// 	} catch {
	// 		return false;
	// 	}
	// },

	// async setupHearing(reference) {
	// 	try {
	// 		const url = `${baseUrl}appeals/${reference}/set-up-hearing`;
	// 		const response = await fetch(url, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			}
	// 		});
	// 		expect(response.status).eq(201);
	// 	} catch {
	// 		return false;
	// 	}
	// },

	// async addEstimate(procedureType, appealId, estimate = null) {
	// 	try {
	// 		let requestBody;
	// 		if (estimate) {
	// 			requestBody = estimate;
	// 		} else requestBody = createApiSubmission(appealsApiRequests.estimateDetails);

	// 		const url = `${baseUrl}appeals/${appealId}/${procedureType}-estimates`;
	// 		const response = await fetch(url, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			},
	// 			body: JSON.stringify(requestBody)
	// 		});

	// 		expect(response.status).eq(201);
	// 		return await response.json();
	// 	} catch {
	// 		return false;
	// 	}
	// },

	// async deleteEstimate(procedureType, appealId) {
	// 	try {
	// 		const url = `${baseUrl}appeals/${appealId}/${procedureType}-estimates`;
	// 		const response = await fetch(url, {
	// 			method: 'DELETE',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			}
	// 		});
	// 		expect(response.status).eq(200);
	// 		return await response.json();
	// 	} catch {
	// 		return false;
	// 	}
	// },

	assignCaseOfficer(appealId) {
		return cy.request({
			method: 'PATCH',
			url: `${baseUrl}appeals/${appealId}`,
			headers: {
				'Content-Type': 'application/json',
				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
			},
			body: {
				caseOfficerId: '544f5029-e660-4bc3-81b1-adc19d47e970'
			},
			failOnStatusCode: false
		}).then(({ status, body }) => {
			expect(status).to.eq(200);
			return body;
		});
	},

	// async deleteAppeals(appealId) {
	// 	try {
	// 		const url = `${baseUrl}appeals/delete-appeals`;
	// 		const response = await fetch(url, {
	// 			method: 'DELETE',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			},
	// 			body: JSON.stringify({
	// 				appealIds: appealId
	// 			})
	// 		});
	// 		expect(response.status).eq(200);
	// 	} catch {
	// 		return false;
	// 	}
	// },

	startAppeal(appealReference) {
		return cy.request({
			method: 'POST',
			url: `${baseUrl}appeals/${appealReference}/start-appeal`,
			headers: {
				'Content-Type': 'application/json',
				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
			},
			failOnStatusCode: false
		}).then(({ status }) => {
			expect(status).to.eq(201);
			return true;
		});
	},

	// reviewLpaq(appealReference) {
	// 	return cy.request({
	// 		method: 'POST',
	// 		url: `${baseUrl}appeals/${appealReference}/review-lpaq`,
	// 		headers: {
	// 			'Content-Type': 'application/json',
	// 			azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 		},
	// 		failOnStatusCode: false
	// 	}).then(({ status, body }) => {			
	// 		expect(body.validationOutcome.name).to.eq('Complete');
	// 		return body;
	// 	});
	// }

	async reviewLpaq(appealReference) {
		// Add detailed logging around the review-lpaq call to help debug 500s and other failures
		const url = `${baseUrl}appeals/${appealReference}/review-lpaq`;
		const headers = {
			'Content-Type': 'application/json',
			azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
		};

		console.log('[reviewLpaq] POST', url);
		console.log('[reviewLpaq] headers', headers);

		let response;
		try {
			response = await fetch(url, { method: 'POST', headers });
		} catch (networkErr) {
			console.error('[reviewLpaq] network error:', networkErr);
			throw new Error(`reviewLpaq network error: ${networkErr?.message || networkErr}`);
		}

		const status = response.status;
		console.log('[reviewLpaq] status', status);

		let bodyText = '';
		let bodyJson = null;
		const contentType = response.headers?.get?.('content-type') || '';
		try {
			if (contentType.includes('application/json')) {
				bodyJson = await response.json();
				console.log('[reviewLpaq] body (json)', bodyJson);
			} else {
				bodyText = await response.text();
				console.log('[reviewLpaq] body (text)', bodyText);
			}
		} catch (parseErr) {
			console.warn('[reviewLpaq] failed to parse response body', parseErr);
		}

		if (status !== 200) {
			// throw with rich context so Cypress shows it in the test output
			const details = bodyJson || bodyText || '(no body)';
			throw new Error(`reviewLpaq failed: HTTP ${status} ${typeof details === 'string' ? details : JSON.stringify(details)}`);
		}

		// Validate expected contract and log if missing
		const validationName = bodyJson?.validationOutcome?.name;
		if (!validationName) {
			console.warn('[reviewLpaq] missing validationOutcome.name in response');
		}
		try {
			expect(validationName).eq('Complete');
		} catch (assertErr) {
			console.error('[reviewLpaq] assertion failed: expected validationOutcome.name === "Complete"', {
				validationName
			});
			throw assertErr;
		}

		return bodyJson;
	}

	// async reviewLpaq(appealReference) {
	// 	try {
	// 		const url = `${baseUrl}appeals/${appealReference}/review-lpaq`;
	// 		const response = await fetch(url, {
	// 			method: 'POST',
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				azureAdUserId: '434bff4e-8191-4ce0-9a0a-91e5d6cdd882'
	// 			}
	// 		});
	// 		expect(response.status).eq(200);
	// 		const body = await response.json();
	// 		expect(body.validationOutcome.name).eq('Complete');
	// 	} catch {
	// 		return false;

	// 	}
	// }
};