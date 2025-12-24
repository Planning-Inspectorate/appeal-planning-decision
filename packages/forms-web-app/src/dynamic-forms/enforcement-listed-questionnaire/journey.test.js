const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseEnforcementListedUrl, ...params } = require('./journey');

const mockResponse = {
	journeyId: 'enforcement-questionnaire',
	LPACode: 'Q9999',
	referenceId: '123',
	answers: {}
};

describe('Enforcement Journey', () => {
	it('should error if no response', () => {
		expect(() => {
			new Journey(params);
		}).toThrow("Cannot read properties of undefined (reading 'referenceId')");
	});

	it('should set baseUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseEnforcementListedUrl));
		expect(journey.baseUrl).toEqual(expect.stringContaining(mockResponse.referenceId));
	});

	it('should set taskListUrl', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.taskListUrl).toEqual('/manage-appeals/questionnaire/123');
	});

	it('should set template', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTemplate).toBe('questionnaire-template.njk');
	});

	it('should set listingPageViewPath', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.listingPageViewPath).toBe('dynamic-components/task-list/questionnaire');
	});

	it('should set informationPageViewPath', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.informationPageViewPath).toBe('dynamic-components/submission-information/index');
	});

	it('should set journeyTitle', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(journey.journeyTitle).toBe('Manage your appeals');
	});

	it('should define sections and questions', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		expect(Array.isArray(journey.sections)).toBe(true);
		expect(journey.sections.length > 0).toBe(true);
		expect(Array.isArray(journey.sections[0].questions)).toBe(true);
		expect(journey.sections[0].questions.length > 0).toBe(true);
	});

	it('should include the "Constraints, designations and other issues" section and verify its structure and content', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		const sectionTitle = 'Constraints, designations and other issues';
		const sectionName = 'constraints';
		const constraintsSection = journey.sections.find((s) => s.name === sectionTitle);

		const expectedQuestions = [
			{
				fieldName: 'correctAppealType',
				question: `Is enforcement the correct type of appeal?`,
				urlSegment: 'correct-appeal-type'
			},
			{
				fieldName: 'changesListedBuilding',
				question: 'Does the proposed development change a listed building?',
				urlSegment: 'changes-listed-building'
			},
			{
				fieldName: 'addChangedListedBuilding',
				question: 'Add another building or site?',
				urlSegment: 'changed-listed-buildings'
			},

			{
				fieldName: 'affectsListedBuilding',
				question: 'Does the proposed development affect the setting of listed buildings?',
				urlSegment: 'affect-listed-building'
			},
			{
				fieldName: 'addAffectedListedBuilding',
				question: 'Add another building or site?',
				urlSegment: 'affected-listed-buildings'
			},

			{
				fieldName: 'affectsScheduledMonument',
				question: 'Would the development affect a scheduled monument?',
				urlSegment: 'scheduled-monument'
			},
			{
				fieldName: 'conservationArea',
				question: 'Is the site in, or next to a conservation area?',
				urlSegment: 'conservation-area'
			},
			{
				fieldName: 'uploadConservation',
				urlSegment: 'upload-conservation-area-map-guidance',
				question: 'Upload conservation map and guidance'
			},

			{
				fieldName: 'protectedSpecies',
				question: 'Would the development affect a protected species?',
				urlSegment: 'protected-species'
			},
			{
				fieldName: 'greenBelt',
				question: 'Is the site in a green belt?',
				urlSegment: 'green-belt'
			},
			{
				fieldName: 'areaOutstandingBeauty',
				urlSegment: 'area-of-outstanding-natural-beauty',
				question: 'Is the site in a national landscape?'
			},
			{
				fieldName: 'designatedSites',
				question: 'Is the development in, near or likely to affect any designated sites?',
				urlSegment: 'designated-sites'
			},
			{
				fieldName: 'treePreservationOrder',
				question: 'Does a Tree Preservation Order (TPO) apply to any part of the appeal site?',
				urlSegment: 'tree-preservation-order'
			},
			{
				fieldName: 'uploadTreePreservationOrder',
				question: 'Upload a plan showing the extent of the order',
				urlSegment: 'upload-plan-showing-order'
			},

			{
				fieldName: 'gypsyTraveller',
				question: 'Does the development relate to anyone claiming to be a Gypsy or Traveller?',
				urlSegment: 'gypsy-traveller'
			},
			{
				fieldName: 'publicRightOfWay',
				question: 'Was a public right of way removed or diverted?',
				urlSegment: 'public-right-of-way'
			},
			{
				fieldName: 'uploadDefinitiveMapStatement',
				question: 'Upload the definitive map and statement extract',
				urlSegment: 'upload-definitive-map-statement'
			},

			// Enforcement specific questions
			{
				fieldName: 'otherOperations',
				question:
					'Does the enforcement notice relate to building, engineering, mining or other operations?',
				urlSegment: 'other-operations'
			},
			{
				fieldName: 'siteAreaSquareMetres',
				question: 'What is the area of the appeal site?',
				urlSegment: 'site-area'
			},
			{
				fieldName: 'allegedBreachArea',
				question: 'Is the area of the alleged breach the same as the site area?',
				urlSegment: 'alleged-breach-area'
			},
			{
				fieldName: 'createFloorSpace',
				question: 'Does the alleged breach create any floor space?',
				urlSegment: 'create-floor-space'
			},
			{
				fieldName: 'refuseWasteMaterials',
				question:
					'Does the enforcement notice include a change of use of land to dispose, refuse or waste materials?',
				urlSegment: 'refuse-waste-materials'
			},
			{
				fieldName: 'mineralExtractionMaterials',
				question:
					'Does the enforcement notice include the change of use of land to dispose of remaining materials after mineral extraction?',
				urlSegment: 'mineral-extraction-materials'
			},
			{
				fieldName: 'storeMinerals',
				question:
					'Does the enforcement notice include a change of use of land to store minerals in the open?',
				urlSegment: 'store-minerals'
			},
			{
				fieldName: 'createBuilding',
				question: 'Does the enforcement notice include the erection of a building or buildings?',
				urlSegment: 'create-building'
			},
			{
				fieldName: 'agriculturalPurposes',
				question:
					'Is the building on agricultural land and will it be used for agricultural purposes?',
				urlSegment: 'agricultural-purposes'
			},
			{
				fieldName: 'singleHouse',
				question: 'Is the enforcement notice for a single private dwelling house?',
				urlSegment: 'single-house'
			},
			{
				fieldName: 'trunkRoad',
				question: 'Is the appeal site within 67 metres of a trunk road?',
				urlSegment: 'trunk-road'
			},
			{
				fieldName: 'crownLand',
				question: 'Is the appeal site on Crown land?',
				urlSegment: 'crown-land'
			},
			{
				fieldName: 'stopNotice',
				question: 'Did you serve a stop notice?',
				urlSegment: 'stop-notice'
			},
			{
				fieldName: 'stopNoticeUpload',
				question: 'Upload the stop notice',
				urlSegment: 'upload-stop-notice'
			},
			{
				fieldName: 'developmentRights',
				question: 'Did you remove any permitted development rights for the appeal site?',
				urlSegment: 'remove-permitted-development-rights'
			},
			{
				fieldName: 'developmentRightsUpload',
				question: 'Upload the article 4 direction',
				urlSegment: 'upload-article-4-direction'
			},
			{
				fieldName: 'developmentRightsRemoved',
				question: 'What permitted development rights did you remove with the direction?',
				urlSegment: 'rights-removed-direction'
			}
		];

		expect(constraintsSection).toBeDefined();

		if (constraintsSection) {
			const questions = constraintsSection.questions;

			expect(constraintsSection.name).toBe(sectionTitle);
			expect(constraintsSection.segment).toBe(sectionName);

			expectedQuestions.forEach((expected, index) => {
				const actual = questions[index];

				expect(actual).toBeDefined();
				expect(actual.fieldName).toBe(expected.fieldName);
				expect(actual.url).toBe(expected.urlSegment);
				expect(actual.question).toBe(expected.question);
			});
		}
	});

	it('should include the "Notifying relevant parties" section and verify its structure', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		const sectionTitle = 'Notifying relevant parties';
		const notifiedSection = journey.sections.find((s) => s.name === sectionTitle);

		expect(notifiedSection).toBeDefined();

		if (notifiedSection) {
			const questions = notifiedSection.questions || [];

			expect(notifiedSection.name).toBe(sectionTitle);
			expect(questions.length).toBe(2);

			const question1 = questions[0];
			expect(question1.title).toBe(
				'Upload the list of people that you served the enforcement notice to'
			);
			expect(question1.fieldName).toBe('listOfPeopleSentEnforcementNotice');
			expect(question1.url).toContain('upload-enforcement-list');

			const question2 = questions[1];
			expect(question2.title).toBe('Appeal notification letter');
			expect(question2.fieldName).toBe('appealNotification');
			expect(question2.url).toContain('appeal-notification-letter');
		}
	});

	it('should include the "Planning officer’s report and supporting documents" section and verify its structure and content', () => {
		const journey = new Journey({ ...params, response: mockResponse });

		const sectionTitle = 'Planning officer’s report and supporting documents';
		const sectionName = 'planning-officer-report';
		const planningOfficerSection = journey.sections.find((s) => s.name === sectionTitle);

		const expectedQuestions = [
			// New starting qs
			{
				fieldName: 'planningOfficerReport',
				question: 'Do you have a planning officer’s report?',
				urlSegment: 'planning-officer-report'
			},
			// Existing Questions
			{
				fieldName: 'uploadPlanningOfficerReport',
				question:
					'Upload the planning officer’s report or what your decision notice would have said',
				urlSegment: 'upload-planning-officers-report-decision-notice'
			},
			{
				fieldName: 'developmentPlanPolicies',
				question: 'Do you have any relevant policies from your statutory development plan?',
				urlSegment: 'other-development-plan-policies'
			},
			{
				fieldName: 'uploadDevelopmentPlanPolicies',
				question: 'Upload relevant policies from your statutory development plan',
				urlSegment: 'upload-development-plan-policies'
			},
			{
				fieldName: 'otherRelevantPolicies',
				question: 'Do you have any other relevant policies to upload?',
				urlSegment: 'other-relevant-policies'
			},
			{
				fieldName: 'uploadOtherPolicies',
				question: 'Upload any other relevant policies',
				urlSegment: 'upload-other-relevant-policies'
			},
			{
				fieldName: 'supplementaryPlanningDocs',
				question:
					'Did any supplementary planning documents inform the outcome of the planning application?',
				urlSegment: 'supplementary-planning-documents'
			},
			{
				fieldName: 'uploadSupplementaryPlanningDocs',
				question: 'Upload relevant policy extracts and supplementary planning documents',
				urlSegment: 'upload-policies-supplementary-planning-documents'
			},
			{
				fieldName: 'infrastructureLevy',
				question: 'Do you have a community infrastructure levy?',
				urlSegment: 'community-infrastructure-levy'
			},
			{
				fieldName: 'uploadInfrastructureLevy',
				question: 'Upload your community infrastructure levy',
				urlSegment: 'upload-community-infrastructure-levy'
			},
			{
				fieldName: 'infrastructureLevyAdopted',
				question: 'Is the community infrastructure levy formally adopted?',
				urlSegment: 'community-infrastructure-levy-adopted'
			},
			{
				fieldName: 'infrastructureLevyAdoptedDate',
				question: 'When was the community infrastructure levy formally adopted?'
			},
			{
				fieldName: 'infrastructureLevyExpectedDate',
				question: 'When do you expect to formally adopt the community infrastructure levy?'
			},

			// New Enforcement Questions
			{
				fieldName: 'localDevelopmentOrder',
				question: 'Do you have a local development order?',
				urlSegment: 'local-development-order'
			},
			{
				fieldName: 'localDevelopmentOrderUpload',
				question: 'Upload the local development order',
				urlSegment: 'upload-local-development-order'
			},
			{
				fieldName: 'previousPlanningPermission',
				question: 'Did you previously grant any planning permission for this development?',
				urlSegment: 'previous-planning-permission'
			},
			{
				fieldName: 'previousPlanningPermissionUpload',
				question: 'Upload the planning permission and any other relevant documents',
				urlSegment: 'upload-planning-permission'
			},
			{
				fieldName: 'noticeDateApplication',
				question: 'Was there an enforcement notice in force at the date of the application?',
				urlSegment: 'enforcement-notice-date-application'
			},
			{
				fieldName: 'noticeDateApplicationUpload',
				question: 'Upload the enforcement notice',
				urlSegment: 'upload-enforcement-notice'
			},
			{
				fieldName: 'noticePlanUpload',
				question: 'Upload the enforcement notice plan',
				urlSegment: 'upload-enforcement-notice-plan'
			},
			{
				fieldName: 'planningContraventionNotice',
				question: 'Did you serve a planning contravention notice?',
				urlSegment: 'planning-contravention-notice'
			},
			{
				fieldName: 'planningContraventionNoticeUpload',
				question: 'Upload the planning contravention notice',
				urlSegment: 'upload-planning-contravention-notice'
			}
		];

		expect(planningOfficerSection).toBeDefined();

		if (planningOfficerSection) {
			const questions = planningOfficerSection.questions;

			expect(planningOfficerSection.name).toBe(sectionTitle);
			expect(planningOfficerSection.segment).toBe(sectionName);

			expectedQuestions.forEach((expected, index) => {
				const actual = questions[index];

				expect(actual).toBeDefined();
				expect(actual.fieldName).toBe(expected.fieldName);
				expect(actual.url).toBe(expected.urlSegment);
				expect(actual.question).toBe(expected.question);
			});
		}
	});

	it('should include the "Environmental impact assessment" section and verify its structure and content', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		const sectionTitle = 'Environmental impact assessment';
		const sectionName = 'environmental-impact';
		const constraintsSection = journey.sections.find((s) => s.name === sectionTitle);

		const expectedQuestions = [
			{
				fieldName: 'environmentalImpactSchedule',
				question: `What is the development category?`,
				urlSegment: 'schedule-1-or-2'
			},
			{
				fieldName: 'developmentDescription',
				question: `Description of development`,
				urlSegment: 'development-description'
			},
			{
				fieldName: 'sensitiveArea',
				question: `Is the development in, partly in, or likely to affect a sensitive area?`,
				urlSegment: 'sensitive-area'
			},
			{
				fieldName: 'columnTwoThreshold',
				question: `Does the development meet or exceed the threshold or criteria in column 2?`,
				urlSegment: 'column-2-threshold'
			},
			{
				fieldName: 'screeningOpinion',
				question: `Have you issued a screening opinion?`,
				urlSegment: 'screening-opinion'
			},
			{
				fieldName: 'uploadScreeningOpinion',
				question: `Upload your screening opinion and any correspondence`,
				urlSegment: 'upload-screening-opinion'
			},
			{
				fieldName: 'environmentalStatement',
				question: `Did your screening opinion say the development needed an environmental statement?`,
				urlSegment: 'screening-opinion-environmental-statement'
			},
			{
				fieldName: 'appellantSubmittedEnvironmentalStatement',
				question: `Did the appellant submit an environmental statement?`,
				urlSegment: 'environmental-statement'
			},
			{
				fieldName: 'uploadEnvironmentalStatement',
				question: `Upload the environmental statement and supporting information`,
				urlSegment: 'upload-environmental-statement'
			},
			{
				fieldName: 'uploadScreeningDirection',
				question: 'Upload the screening direction',
				urlSegment: 'upload-screening-direction'
			}
		];

		expect(constraintsSection).toBeDefined();

		if (constraintsSection) {
			const questions = constraintsSection.questions;

			expect(constraintsSection.name).toBe(sectionTitle);
			expect(constraintsSection.segment).toBe(sectionName);

			expectedQuestions.forEach((expected, index) => {
				const actual = questions[index];

				expect(actual).toBeDefined();
				expect(actual.fieldName).toBe(expected.fieldName);
				expect(actual.url).toBe(expected.urlSegment);
				expect(actual.question).toBe(expected.question);
			});
		}
	});

	it('should include the "Appeal process" section and verify its structure and content', () => {
		const journey = new Journey({ ...params, response: mockResponse });
		const sectionTitle = 'Appeal process';
		const sectionName = 'appeal-process';
		const constraintsSection = journey.sections.find((s) => s.name === sectionTitle);

		const expectedQuestions = [
			{
				fieldName: 'lpaProcedurePreference',
				question: `Which procedure do you think is most appropriate for this appeal?`,
				urlSegment: 'procedure-type'
			},
			{
				fieldName: 'lpaPreferInquiryDetails',
				question: `Why would you prefer an inquiry?`
			},
			{
				fieldName: 'lpaPreferHearingDetails',
				question: `Why would you prefer a hearing?`
			},
			{
				fieldName: 'nearbyAppeals',
				question: `Are there any other ongoing appeals next to, or close to the site?`,
				urlSegment: 'ongoing-appeals'
			},
			{
				fieldName: 'addNearbyAppeal',
				question: `Add another appeal?`,
				urlSegment: 'appeal-reference-number'
			},
			{
				fieldName: 'newConditions',
				question: `Check if there are any new conditions`,
				urlSegment: 'new-conditions'
			}
		];

		expect(constraintsSection).toBeDefined();

		if (constraintsSection) {
			const questions = constraintsSection.questions;

			expect(constraintsSection.name).toBe(sectionTitle);
			expect(constraintsSection.segment).toBe(sectionName);

			expectedQuestions.forEach((expected, index) => {
				const actual = questions[index];

				expect(actual).toBeDefined();
				expect(actual.fieldName).toBe(expected.fieldName);
				expect(actual.url).toBe(expected.urlSegment);
				expect(actual.question).toBe(expected.question);
			});
		}
	});
});
