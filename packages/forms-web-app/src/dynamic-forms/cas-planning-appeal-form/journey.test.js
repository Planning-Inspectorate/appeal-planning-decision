const { Journey } = require('@pins/dynamic-forms/src/journey');
const journeyModule = require('./journey');
const { baseCASPlanningSubmissionUrl, ...params } = journeyModule;

const mockResponse = {
	journeyId: 'CAS',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('CAS Appeal Form Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});
	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseCASPlanningSubmissionUrl));
		expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
	});

	it('should set taskListUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.taskListUrl).toEqual('/appeals/cas-planning/appeal-form/your-appeal?id=123');
	});

	it('should set template', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTemplate).toBe('submission-form-template.njk');
	});
	it('should set journeyTitle', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTitle).toBe('Appeal a planning decision');
	});

	describe('uploadAppellantStatement condition', () => {
		it('should include uploadAppellantStatement if application date is before April 1st 2026', () => {
			const answers = { onApplicationDate: '2026-03-30T12:00:00.000Z' };
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers
				}
			});
			const uploadSection = journey.getSection('upload-documents');
			const statementQuestion = uploadSection?.questions?.find(
				(q) => q.fieldName === 'uploadAppellantStatement'
			);
			expect(statementQuestion?.shouldDisplay(journey.response)).toBe(true);
		});

		it('should not include uploadAppellantStatement if application date is on or after April 1st 2026', () => {
			const answers = { onApplicationDate: '2026-04-01T00:00:00.000Z' };
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers
				}
			});
			const uploadSection = journey.getSection('upload-documents');
			const statementQuestion = uploadSection?.questions?.find(
				(q) => q.fieldName === 'uploadAppellantStatement'
			);
			expect(statementQuestion?.shouldDisplay(journey.response)).toBe(false);
		});

		it('should include uploadAppellantStatement if application date is not set', () => {
			const answers = {};
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers
				}
			});
			const uploadSection = journey.getSection('upload-documents');
			const statementQuestion = uploadSection?.questions?.find(
				(q) => q.fieldName === 'uploadAppellantStatement'
			);
			expect(statementQuestion?.shouldDisplay(journey.response)).toBe(true);
		});

		it('should display the anySignificantChanges and WhyAreYouAppealing if application date is on or after April 1st 2026', () => {
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers: {
						onApplicationDate: '2026-04-30T12:00:00.000Z'
					}
				}
			});

			expect(
				journey.sections[0].questions
					.find((question) => question.title.includes('Why are you appealing?'))
					?.shouldDisplay({
						...mockResponse,
						answers: {
							onApplicationDate: '2026-04-30T12:00:00.000Z'
						}
					})
			).toBe(true);

			expect(
				journey.sections[0].questions
					.find((question) =>
						question.title.includes(
							'Have there been any significant changes that would affect the application?'
						)
					)
					?.shouldDisplay({
						...mockResponse,
						answers: {
							onApplicationDate: '2026-04-30T12:00:00.000Z'
						}
					})
			).toBe(true);
		});
	});

	describe('designAccessStatement condition', () => {
		it('should include designAccessStatement if application date is before April 1st 2026', () => {
			const answers = { onApplicationDate: '2026-03-30T12:00:00.000Z' };
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers
				}
			});
			const uploadSection = journey.getSection('upload-documents');
			const designAccessQuestion = uploadSection?.questions?.find(
				(q) => q.fieldName === 'designAccessStatement'
			);
			expect(designAccessQuestion?.shouldDisplay(journey.response)).toBe(true);
		});

		it('should not include designAccessStatement if application date is on or after April 1st 2026', () => {
			const answers = { onApplicationDate: '2026-04-01T00:00:00.000Z' };
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers
				}
			});
			const uploadSection = journey.getSection('upload-documents');
			const designAccessQuestion = uploadSection?.questions?.find(
				(q) => q.fieldName === 'designAccessStatement'
			);
			expect(designAccessQuestion?.shouldDisplay(journey.response)).toBe(false);
		});

		it('should include designAccessStatement if application date is not set', () => {
			const answers = {};
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers
				}
			});
			const uploadSection = journey.getSection('upload-documents');
			const designAccessQuestion = uploadSection?.questions?.find(
				(q) => q.fieldName === 'designAccessStatement'
			);
			expect(designAccessQuestion?.shouldDisplay(journey.response)).toBe(true);
		});

		it('should include uploadDesignAccessStatement if designAccessStatement is yes and application date is before April 1st 2026', () => {
			const answers = {
				onApplicationDate: '2026-03-30T12:00:00.000Z',
				designAccessStatement: 'yes'
			};
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers
				}
			});
			const uploadSection = journey.getSection('upload-documents');
			const uploadDesignAccessQuestion = uploadSection?.questions?.find(
				(q) => q.fieldName === 'uploadDesignAccessStatement'
			);
			expect(uploadDesignAccessQuestion?.shouldDisplay(journey.response)).toBe(true);
		});

		it('should not include uploadDesignAccessStatement if designAccessStatement is no and application date is before April 1st 2026', () => {
			const answers = {
				onApplicationDate: '2026-03-30T12:00:00.000Z',
				designAccessStatement: 'no'
			};
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers
				}
			});
			const uploadSection = journey.getSection('upload-documents');
			const uploadDesignAccessQuestion = uploadSection?.questions?.find(
				(q) => q.fieldName === 'uploadDesignAccessStatement'
			);
			expect(uploadDesignAccessQuestion?.shouldDisplay(journey.response)).toBe(false);
		});

		it('should not include uploadDesignAccessStatement if application date is on or after April 1st 2026 even if designAccessStatement is yes', () => {
			const answers = {
				onApplicationDate: '2026-04-01T00:00:00.000Z',
				designAccessStatement: 'yes'
			};
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers
				}
			});
			const uploadSection = journey.getSection('upload-documents');
			const uploadDesignAccessQuestion = uploadSection?.questions?.find(
				(q) => q.fieldName === 'uploadDesignAccessStatement'
			);
			expect(uploadDesignAccessQuestion?.shouldDisplay(journey.response)).toBe(false);
		});
	});

	describe('uploadPlansDrawingsDocuments condition', () => {
		it('should include uploadPlansDrawingsDocuments if application date is before April 1st 2026', () => {
			const answers = { onApplicationDate: '2026-03-30T12:00:00.000Z' };
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers
				}
			});
			const uploadSection = journey.getSection('upload-documents');
			const plansQuestion = uploadSection?.questions?.find(
				(q) => q.fieldName === 'uploadPlansDrawings'
			);
			expect(plansQuestion?.shouldDisplay(journey.response)).toBe(true);
		});

		it('should not include uploadPlansDrawingsDocuments if application date is on or after April 1st 2026', () => {
			const answers = { onApplicationDate: '2026-04-01T00:00:00.000Z' };
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers
				}
			});
			const uploadSection = journey.getSection('upload-documents');
			const plansQuestion = uploadSection?.questions?.find(
				(q) => q.fieldName === 'uploadPlansDrawings'
			);
			expect(plansQuestion?.shouldDisplay(journey.response)).toBe(false);
		});

		it('should include uploadPlansDrawingsDocuments if application date is not set', () => {
			const answers = {};
			const journey = new Journey({
				...params,
				response: {
					...mockResponse,
					answers
				}
			});
			const uploadSection = journey.getSection('upload-documents');
			const plansQuestion = uploadSection?.questions?.find(
				(q) => q.fieldName === 'uploadPlansDrawings'
			);
			expect(plansQuestion?.shouldDisplay(journey.response)).toBe(true);
		});
	});
});
