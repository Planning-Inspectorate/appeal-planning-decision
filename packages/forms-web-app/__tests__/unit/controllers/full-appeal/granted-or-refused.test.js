const appeal = require('@pins/business-rules/test/data/full-appeal');
const {
	getGrantedOrRefused,
	postGrantedOrRefused,
	forwardPage
} = require('../../../../src/controllers/full-appeal/granted-or-refused');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const {
	VIEW: {
		FULL_APPEAL: { GRANTED_OR_REFUSED, DECISION_DATE, DATE_DECISION_DUE },
		BEFORE_YOU_START: { USE_EXISTING_SERVICE_APPLICATION_TYPE }
	}
} = require('../../../../src/lib/views');
const { APPEAL_ID, TYPE_OF_PLANNING_APPLICATION } = require('@pins/business-rules/src/constants');
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');
const { isLpaInFeatureFlag } = require('#lib/is-lpa-in-feature-flag');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');
jest.mock('../../../../src/lib/is-lpa-in-feature-flag');

describe('controllers/full-appeal/granted-or-refused', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq(appeal);
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getGrantedOrRefusedPlanningApplication', () => {
		it('should call the correct template', () => {
			getGrantedOrRefused(req, res);

			expect(res.render).toHaveBeenCalledWith(GRANTED_OR_REFUSED, {
				appeal: req.session.appeal
			});
		});
	});

	describe('forwardPage', () => {
		it(`should return '/${DECISION_DATE}' if passed 'permissionStatus' is 'granted'`, async () => {
			const pageRedirect = forwardPage('granted');

			expect(pageRedirect).toEqual('/before-you-start/decision-date');
		});

		it(`should return '/${DECISION_DATE}' if passed 'permissionStatus' is 'refused'`, async () => {
			const pageRedirect = forwardPage('refused');

			expect(pageRedirect).toEqual('/before-you-start/decision-date');
		});

		it(`should return '/${DATE_DECISION_DUE}' if passed 'permissionStatus' is 'nodecisionreceived'`, async () => {
			const pageRedirect = forwardPage('nodecisionreceived');

			expect(pageRedirect).toEqual('/before-you-start/date-decision-due');
		});
		it(`should return '/${GRANTED_OR_REFUSED}' if passed 'permissionStatus' is 'default'`, async () => {
			const pageRedirect = forwardPage('default');

			expect(pageRedirect).toEqual(GRANTED_OR_REFUSED);
		});

		it(`should return '/${GRANTED_OR_REFUSED}' if 'permissionStatus' is not passed`, async () => {
			const pageRedirect = forwardPage();

			expect(pageRedirect).toEqual(GRANTED_OR_REFUSED);
		});
	});

	describe('postGrantedOrRefusedPlanning', () => {
		it('should re-render the template with errors if there is any validation error', async () => {
			isLpaInFeatureFlag.mockReturnValue(true);
			const mockRequest = {
				...req,
				body: {
					'granted-or-refused': null,
					errors: { a: 'b' },
					errorSummary: [{ text: 'There were errors here', href: '#' }]
				}
			};
			await postGrantedOrRefused(mockRequest, res);

			expect(createOrUpdateAppeal).not.toHaveBeenCalled();

			expect(res.redirect).not.toHaveBeenCalled();

			expect(res.render).toHaveBeenCalledWith(GRANTED_OR_REFUSED, {
				appeal: {
					...req.session.appeal,
					eligibility: {
						...req.session.appeal.eligibility,
						applicationDecision: null
					}
				},
				errorSummary: [{ text: 'There were errors here', href: '#' }],
				errors: { a: 'b' }
			});
		});

		it('should re-render the template with errors if there is any api call error', async () => {
			isLpaInFeatureFlag.mockReturnValue(true);
			const mockRequest = {
				...req,
				body: {}
			};

			const error = new Error('Api call error');
			createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

			await postGrantedOrRefused(mockRequest, res);

			expect(res.redirect).not.toHaveBeenCalled();

			expect(logger.error).toHaveBeenCalledWith(error);

			expect(res.render).toHaveBeenCalledWith(GRANTED_OR_REFUSED, {
				appeal: req.session.appeal,
				errors: {},
				errorSummary: [{ text: error.toString(), href: '#' }]
			});
		});

		it(`'should redirect to '/${DECISION_DATE}' if 'applicationDecision' is 'refused'`, async () => {
			isLpaInFeatureFlag.mockReturnValue(true);
			const applicationDecision = 'refused';
			const mockRequest = {
				...req,
				body: {
					'granted-or-refused': applicationDecision
				}
			};
			await postGrantedOrRefused(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
		});

		it(`should redirect to '/${DECISION_DATE}' if 'applicationDecision' is 'granted'`, async () => {
			isLpaInFeatureFlag.mockReturnValue(true);
			const applicationDecision = 'granted';
			const mockRequest = {
				...req,
				body: { 'granted-or-refused': applicationDecision }
			};
			await postGrantedOrRefused(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
		});

		it(`should redirect to '/${DATE_DECISION_DUE}' if 'applicationDecision' is 'nodecisionreceived'`, async () => {
			isLpaInFeatureFlag.mockReturnValue(true);
			const applicationDecision = 'nodecisionreceived';
			const mockRequest = {
				...req,
				body: { 'granted-or-refused': applicationDecision }
			};
			await postGrantedOrRefused(mockRequest, res);

			expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start/date-decision-due');
		});

		describe('Type of planning application is Advertisement', () => {
			it(`'should redirect to '/${DECISION_DATE}' with appeal type MINOR_COMMERCIAL_ADVERTISEMENT if 'applicationDecision' is 'refused'`, async () => {
				isLpaInFeatureFlag.mockReturnValue(true);
				const applicationDecision = 'refused';
				const mockRequest = {
					...req,
					body: {
						'granted-or-refused': applicationDecision
					},
					session: {
						...req.session,
						appeal: {
							...req.session.appeal,
							typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT,
							appealType: APPEAL_ID.ADVERTISEMENT
						}
					}
				};

				await postGrantedOrRefused(mockRequest, res);

				const advertisementApplicationAppeal = {
					...appeal,
					typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT,
					appealType: APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT
				};

				expect(createOrUpdateAppeal).toHaveBeenCalledWith(advertisementApplicationAppeal);

				expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
			});

			it(`'should redirect to '/${USE_EXISTING_SERVICE_APPLICATION_TYPE}' if 'applicationDecision' is 'refused' and CAS advert feature flag is false`, async () => {
				isLpaInFeatureFlag.mockReturnValueOnce(false); // CAS advert feature flag
				isLpaInFeatureFlag.mockReturnValueOnce(true); // advert feature flag
				const applicationDecision = 'refused';
				const mockRequest = {
					...req,
					body: {
						'granted-or-refused': applicationDecision
					},
					session: {
						...req.session,
						appeal: {
							...req.session.appeal,
							typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT,
							appealType: APPEAL_ID.ADVERTISEMENT
						}
					}
				};

				await postGrantedOrRefused(mockRequest, res);
				expect(res.redirect).toHaveBeenCalledWith(
					'/before-you-start/use-existing-service-application-type'
				);
			});

			it(`'should redirect to '/${DECISION_DATE}' with appeal type ADVERTISEMENT if 'applicationDecision' is 'granted'`, async () => {
				isLpaInFeatureFlag.mockReturnValue(true);
				const applicationDecision = 'granted';
				const mockRequest = {
					...req,
					body: {
						'granted-or-refused': applicationDecision
					},
					session: {
						...req.session,
						appeal: {
							...req.session.appeal,
							typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT,
							appealType: APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT
						}
					}
				};

				await postGrantedOrRefused(mockRequest, res);

				const advertisementApplicationAppeal = {
					...appeal,
					typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT,
					appealType: APPEAL_ID.ADVERTISEMENT
				};

				expect(createOrUpdateAppeal).toHaveBeenCalledWith(advertisementApplicationAppeal);

				expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
			});

			it(`'should redirect to '/${USE_EXISTING_SERVICE_APPLICATION_TYPE}' if 'applicationDecision' is 'granted' and advert feature flag is false`, async () => {
				isLpaInFeatureFlag.mockReturnValueOnce(true); // CAS advert feature flag
				isLpaInFeatureFlag.mockReturnValueOnce(false); // advert feature flag
				const applicationDecision = 'granted';
				const mockRequest = {
					...req,
					body: {
						'granted-or-refused': applicationDecision
					},
					session: {
						...req.session,
						appeal: {
							...req.session.appeal,
							typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT,
							appealType: APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT
						}
					}
				};

				await postGrantedOrRefused(mockRequest, res);
				expect(res.redirect).toHaveBeenCalledWith(
					'/before-you-start/use-existing-service-application-type'
				);
			});

			it(`'should redirect to '/${DATE_DECISION_DUE}' with appeal type ADVERTISEMENT if 'applicationDecision' is 'nodecisionreceived'`, async () => {
				isLpaInFeatureFlag.mockReturnValue(true);
				const applicationDecision = 'nodecisionreceived';
				const mockRequest = {
					...req,
					body: {
						'granted-or-refused': applicationDecision
					},
					session: {
						...req.session,
						appeal: {
							...req.session.appeal,
							typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT,
							appealType: APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT
						}
					}
				};

				await postGrantedOrRefused(mockRequest, res);

				const advertisementApplicationAppeal = {
					...appeal,
					typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT,
					appealType: APPEAL_ID.ADVERTISEMENT
				};

				expect(createOrUpdateAppeal).toHaveBeenCalledWith(advertisementApplicationAppeal);

				expect(res.redirect).toHaveBeenCalledWith('/before-you-start/date-decision-due');
			});

			it(`'should redirect to '/${USE_EXISTING_SERVICE_APPLICATION_TYPE}' if 'applicationDecision' is 'nodecisionreceived' and advert feature flag is false`, async () => {
				isLpaInFeatureFlag.mockReturnValueOnce(true); // CAS advert feature flag
				isLpaInFeatureFlag.mockReturnValueOnce(false); // advert feature flag
				const applicationDecision = 'nodecisionreceived';
				const mockRequest = {
					...req,
					body: {
						'granted-or-refused': applicationDecision
					},
					session: {
						...req.session,
						appeal: {
							...req.session.appeal,
							typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.ADVERTISEMENT,
							appealType: APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT
						}
					}
				};

				await postGrantedOrRefused(mockRequest, res);
				expect(res.redirect).toHaveBeenCalledWith(
					'/before-you-start/use-existing-service-application-type'
				);
			});
		});

		describe('Type of planning application is MINOR_COMMERCIAL_DEVELOPMENT', () => {
			describe('Appeal type is PLANNING_SECTION_78 on input to this question', () => {
				const fullPlanningApplicationAppeal = {
					...appeal,
					typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
					appealType: APPEAL_ID.PLANNING_SECTION_78
				};

				it(`'should redirect to '/${DECISION_DATE}' with appeal type PLANNING_SECTION_78 when 'applicationDecision' is 'granted'`, async () => {
					isLpaInFeatureFlag.mockReturnValue(true);
					const applicationDecision = 'granted';
					const mockRequest = {
						...req,
						body: {
							'granted-or-refused': applicationDecision
						},
						session: {
							...req.session,
							appeal: {
								...req.session.appeal,
								typeOfPlanningApplication:
									TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
								appealType: APPEAL_ID.PLANNING_SECTION_78
							}
						}
					};

					await postGrantedOrRefused(mockRequest, res);

					expect(createOrUpdateAppeal).toHaveBeenCalledWith(fullPlanningApplicationAppeal);

					expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
				});

				it(`'should redirect to '/${DECISION_DATE}' with appeal type PLANNING_SECTION_78 when 'applicationDecision' is 'refused'`, async () => {
					isLpaInFeatureFlag.mockReturnValue(true);
					const applicationDecision = 'refused';
					const mockRequest = {
						...req,
						body: {
							'granted-or-refused': applicationDecision
						},
						session: {
							...req.session,
							appeal: {
								...req.session.appeal,
								typeOfPlanningApplication:
									TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
								appealType: APPEAL_ID.PLANNING_SECTION_78
							}
						}
					};

					await postGrantedOrRefused(mockRequest, res);

					expect(createOrUpdateAppeal).toHaveBeenCalledWith(fullPlanningApplicationAppeal);

					expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
				});

				it(`'should redirect to '/${DATE_DECISION_DUE}' with appeal type PLANNING_SECTION_78 when 'applicationDecision' is 'nodecisionreceived'`, async () => {
					isLpaInFeatureFlag.mockReturnValue(true);
					const applicationDecision = 'nodecisionreceived';
					const mockRequest = {
						...req,
						body: {
							'granted-or-refused': applicationDecision
						},
						session: {
							...req.session,
							appeal: {
								...req.session.appeal,
								typeOfPlanningApplication:
									TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
								appealType: APPEAL_ID.PLANNING_SECTION_78
							}
						}
					};

					await postGrantedOrRefused(mockRequest, res);

					expect(createOrUpdateAppeal).toHaveBeenCalledWith(fullPlanningApplicationAppeal);

					expect(res.redirect).toHaveBeenCalledWith('/before-you-start/date-decision-due');
				});
			});

			describe('Appeal type is MINOR_COMMERCIAL on input to this question', () => {
				const fullPlanningApplicationAppeal = {
					...appeal,
					typeOfPlanningApplication: TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
					appealType: APPEAL_ID.PLANNING_SECTION_78
				};

				const casPlanningApplicationAppeal = {
					...fullPlanningApplicationAppeal,
					appealType: APPEAL_ID.MINOR_COMMERCIAL
				};

				it(`'should redirect to '/${DECISION_DATE}' with appeal type PLANNING_SECTION_78 when 'applicationDecision' is 'granted'`, async () => {
					isLpaInFeatureFlag.mockReturnValue(true);
					const applicationDecision = 'granted';
					const mockRequest = {
						...req,
						body: {
							'granted-or-refused': applicationDecision
						},
						session: {
							...req.session,
							appeal: {
								...req.session.appeal,
								typeOfPlanningApplication:
									TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
								appealType: APPEAL_ID.MINOR_COMMERCIAL
							}
						}
					};

					await postGrantedOrRefused(mockRequest, res);

					expect(createOrUpdateAppeal).toHaveBeenCalledWith(fullPlanningApplicationAppeal);

					expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
				});

				it(`'should redirect to '/${DECISION_DATE}' with appeal type MINOR_COMMERCIAL when 'applicationDecision' is 'refused'`, async () => {
					isLpaInFeatureFlag.mockReturnValue(true);
					const applicationDecision = 'refused';
					const mockRequest = {
						...req,
						body: {
							'granted-or-refused': applicationDecision
						},
						session: {
							...req.session,
							appeal: {
								...req.session.appeal,
								typeOfPlanningApplication:
									TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
								appealType: APPEAL_ID.MINOR_COMMERCIAL
							}
						}
					};

					await postGrantedOrRefused(mockRequest, res);

					expect(createOrUpdateAppeal).toHaveBeenCalledWith(casPlanningApplicationAppeal);

					expect(res.redirect).toHaveBeenCalledWith('/before-you-start/decision-date');
				});

				it(`'should redirect to '/${DATE_DECISION_DUE}' with appeal type PLANNING_SECTION_78 when 'applicationDecision' is 'nodecisionreceived'`, async () => {
					isLpaInFeatureFlag.mockReturnValue(true);
					const applicationDecision = 'nodecisionreceived';
					const mockRequest = {
						...req,
						body: {
							'granted-or-refused': applicationDecision
						},
						session: {
							...req.session,
							appeal: {
								...req.session.appeal,
								typeOfPlanningApplication:
									TYPE_OF_PLANNING_APPLICATION.MINOR_COMMERCIAL_DEVELOPMENT,
								appealType: APPEAL_ID.MINOR_COMMERCIAL
							}
						}
					};

					await postGrantedOrRefused(mockRequest, res);

					expect(createOrUpdateAppeal).toHaveBeenCalledWith(fullPlanningApplicationAppeal);

					expect(res.redirect).toHaveBeenCalledWith('/before-you-start/date-decision-due');
				});
			});
		});
	});
});
