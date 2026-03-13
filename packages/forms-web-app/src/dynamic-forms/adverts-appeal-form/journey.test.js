const config = require('../../config');
const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseAdvertsSubmissionUrl, ...params } = require('./journey');
const { APPLICATION_DECISION } = require('@pins/business-rules/src/constants');

const mockResponse = {
	journeyId: 'adverts-appeal-form',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('ADVERTS Appeal Form Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});
	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseAdvertsSubmissionUrl));
		expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
	});

	it('should set taskListUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.taskListUrl).toEqual('/appeals/adverts/appeal-form/your-appeal?id=123');
	});

	it('should set template', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTemplate).toBe('submission-form-template.njk');
	});
	it('should set journeyTitle', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTitle).toBe('Appeal a planning decision');
	});

	it('should display siteAddress and not grid reference when neither is defined', () => {
		const answers = {
			siteAddress: null,
			siteGridReferenceEasting: null,
			siteGridReferenceNorthing: null
		};
		const journey = new Journey({
			...params,
			response: { ...mockResponse, answers: { ...answers } }
		});
		expect(
			journey.sections[0].questions
				.find((question) => question.title.includes('What is the address of the appeal site?'))
				?.shouldDisplay({
					...mockResponse,
					answers: { ...answers }
				})
		).toBe(true);
		expect(
			journey.sections[0].questions
				.find((question) => question.title.includes('Grid reference'))
				?.shouldDisplay({
					...mockResponse,
					answers: { ...answers }
				})
		).toBe(false);
	});

	it('should display grid reference when it is defined and site address is not defined if feature flag is on', () => {
		config.featureFlag.gridReferenceEnabled = true;
		const answers = {
			siteAddress: null,
			siteGridReferenceEasting: '123456',
			siteGridReferenceNorthing: '654321'
		};
		const journey = new Journey({
			...params,
			response: {
				...mockResponse,
				answers: { ...answers }
			}
		});
		expect(
			journey.sections[0].questions
				.find((question) => question.title.includes('What is the address of the appeal site?'))
				?.shouldDisplay({
					...mockResponse,
					answers: { ...answers }
				})
		).toBe(false);
		expect(
			journey.sections[0].questions
				.find((question) => question.title.includes('Grid reference'))
				?.shouldDisplay({
					...mockResponse,
					answers: { ...answers }
				})
		).toBe(true);
	});

	it('should display site address when grid reference is defined and site address is not defined if feature flag is off', () => {
		config.featureFlag.gridReferenceEnabled = false;
		const answers = {
			siteAddress: null,
			siteGridReferenceEasting: '123456',
			siteGridReferenceNorthing: '654321'
		};
		const journey = new Journey({
			...params,
			response: {
				...mockResponse,
				answers: { ...answers }
			}
		});
		expect(
			journey.sections[0].questions
				.find((question) => question.title.includes('What is the address of the appeal site?'))
				?.shouldDisplay({
					...mockResponse,
					answers: { ...answers }
				})
		).toBe(true);
		expect(
			journey.sections[0].questions
				.find((question) => question.title.includes('Grid reference'))
				?.shouldDisplay({
					...mockResponse,
					answers: { ...answers }
				})
		).toBe(false);
	});

	it('should display only site address if both site address and grid reference are defined', () => {
		const answers = {
			siteAddress: true,
			siteGridReferenceEasting: '123456',
			siteGridReferenceNorthing: '654321'
		};
		const journey = new Journey({
			...params,
			response: {
				...mockResponse,
				answers: { ...answers }
			}
		});
		expect(
			journey.sections[0].questions
				.find((question) => question.title.includes('What is the address of the appeal site?'))
				?.shouldDisplay({
					...mockResponse,
					answers: { ...answers }
				})
		).toBe(true);
		expect(
			journey.sections[0].questions
				.find((question) => question.title.includes('Grid reference'))
				?.shouldDisplay({
					...mockResponse,
					answers: { ...answers }
				})
		).toBe(false);
	});

	it('should not display the appellantProcedurePreference for CAS adverts appeals', () => {
		const journey = new Journey({
			...params,
			response: {
				...mockResponse,
				answers: { applicationDecision: APPLICATION_DECISION.REFUSED }
			}
		});
		expect(
			journey.sections[0].questions
				.find((question) =>
					question.title.includes('How would you prefer us to decide your appeal?')
				)
				?.shouldDisplay({
					...mockResponse,
					answers: { applicationDecision: APPLICATION_DECISION.REFUSED }
				})
		).toBe(false);
	});

	it('should display the appellantProcedurePreference for adverts appeals, application decision: granted', () => {
		const journey = new Journey({
			...params,
			response: {
				...mockResponse,
				answers: { applicationDecision: APPLICATION_DECISION.GRANTED }
			}
		});
		expect(
			journey.sections[0].questions
				.find((question) =>
					question.title.includes('How would you prefer us to decide your appeal?')
				)
				?.shouldDisplay({
					...mockResponse,
					answers: { applicationDecision: APPLICATION_DECISION.GRANTED }
				})
		).toBe(true);
	});

	it('should display the appellantProcedurePreference for adverts appeals, application decision: no decision', () => {
		const journey = new Journey({
			...params,
			response: {
				...mockResponse,
				answers: { applicationDecision: APPLICATION_DECISION.NODECISIONRECEIVED }
			}
		});
		expect(
			journey.sections[0].questions
				.find((question) =>
					question.title.includes('How would you prefer us to decide your appeal?')
				)
				?.shouldDisplay({
					...mockResponse,
					answers: { applicationDecision: APPLICATION_DECISION.NODECISIONRECEIVED }
				})
		).toBe(true);
	});
});
