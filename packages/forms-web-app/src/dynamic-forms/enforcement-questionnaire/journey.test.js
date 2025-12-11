const { Journey } = require('@pins/dynamic-forms/src/journey');
const { baseEnforcementUrl, ...params } = require('./journey');

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
		expect(journey.baseUrl).toEqual(expect.stringContaining(baseEnforcementUrl));
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
				question: 'Does the development change a listed building?',
				urlSegment: 'changes-listed-building'
			},
			{
				fieldName: 'addChangedListedBuilding',
				question: 'Add another building or site?',
				urlSegment: 'changed-listed-buildings'
			},

			{
				fieldName: 'affectsListedBuilding',
				question: 'Does the alleged development affect the setting of listed buildings?',
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
				question: 'Would a public right of way need to be removed or diverted?',
				urlSegment: 'public-right-of-way'
			},
			{
				fieldName: 'uploadDefinitiveMapStatement',
				question: 'Upload the definitive map and statement extract',
				urlSegment: 'upload-definitive-map-statement'
			},

			// Enforcement specific questions
			{
				fieldName: 'enforcementOtherOperations',
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
				fieldName: 'enforcementAllegedBreachArea',
				question: 'Is the area of the alleged breach the same as the site area?',
				urlSegment: 'alleged-breach-area'
			},
			{
				fieldName: 'enforcementCreateFloorSpace',
				question: 'Does the alleged breach create any floor space?',
				urlSegment: 'create-floor-space'
			},
			{
				fieldName: 'enforcementRefuseWasteMaterials',
				question:
					'Does the enforcement notice include a change of use of land to dispose refuse or waste materials?',
				urlSegment: 'refuse-waste-materials'
			},
			{
				fieldName: 'enforcementMineralExtractionMaterials',
				question:
					'Does the enforcement notice include the change of use of land to dispose of remaining materials after mineral extraction?',
				urlSegment: 'mineral-extraction-materials'
			},
			{
				fieldName: 'enforcementStoreMinerals',
				question:
					'Does the enforcement notice include a change of use of land to store minerals in the open?',
				urlSegment: 'store-minerals'
			},
			{
				fieldName: 'enforcementCreateBuilding',
				question: 'Does the enforcement notice include the erection of a building or buildings?',
				urlSegment: 'create-building'
			},
			{
				fieldName: 'enforcementAgriculturalPurposes',
				question:
					'Is the building on agricultural land and will it be used for agricultural purposes?',
				urlSegment: 'agricultural-purposes'
			},
			{
				fieldName: 'enforcementSingleHouse',
				question: 'Is the enforcement notice for a single private dwelling house?',
				urlSegment: 'single-house'
			},
			{
				fieldName: 'enforcementTrunkRoad',
				question: 'Is the appeal site within 67 metres of a trunk road?',
				urlSegment: 'trunk-road'
			},
			{
				fieldName: 'enforcementCrownLand',
				question: 'Is the appeal site on Crown land?',
				urlSegment: 'crown-land'
			},
			{
				fieldName: 'enforcementStopNotice',
				question: 'Did you serve a stop notice?',
				urlSegment: 'stop-notice'
			},
			{
				fieldName: 'enforcementStopNoticeUpload',
				question: 'Upload the stop notice',
				urlSegment: 'upload-stop-notice'
			},
			{
				fieldName: 'enforcementDevelopmentRights',
				question: 'Did you remove any permitted development rights for the appeal site?',
				urlSegment: 'remove-permitted-development-rights'
			},
			{
				fieldName: 'enforcementDevelopmentRightsUpload',
				question: 'Upload the article 4 direction',
				urlSegment: 'upload-article-4-direction'
			},
			{
				fieldName: 'enforcementDevelopmentRightsRemoved',
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
			expect(question2.title).toBe(
				'Upload the appeal notification letter and the list of people that you notified'
			);
			expect(question2.fieldName).toBe('appealNotification');
			expect(question2.url).toContain('appeal-notification-letter');
		}
	});
});
