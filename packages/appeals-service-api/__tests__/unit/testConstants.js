const testDate = '2023-11-06T11:40:07.453Z';
const submittedQuestionnaireObjectPreMap = {
	_id: '6548d097d1586a8a2565a6bb',
	uniqueId: 'has-questionnaire:APP/Q9999/W/22/1234567',
	LPACode: 'Q9999',
	answers: {
		'correct-appeal-type': 'yes',
		'affects-listed-building': 'no',
		'conservation-area': 'no',
		'green-belt': 'no',
		'notified-who': {
			uploadedFiles: [
				{
					id: '181b5a3c-e1a9-4ce1-a6aa-9cd7ec7176a1',
					name: 'APP-Q9999-W-22-1234567-Hero-shot-3.jpg',
					fileName: 'APP-Q9999-W-22-1234567-Hero-shot-3.jpg',
					originalFileName: 'Hero-shot-3.jpg',
					location:
						'has-questionnaire:APP_Q9999_W_22_1234567/181b5a3c-e1a9-4ce1-a6aa-9cd7ec7176a1/APP-Q9999-W-22-1234567-Hero-shot-3.jpg',
					size: '216963',
					message: { text: 'APP-Q9999-W-22-1234567-Hero-shot-3.jpg' }
				}
			]
		},
		'display-site-notice': 'no',
		'letters-to-neighbours': 'no',
		'press-advert': 'no',
		'representations-other-parties': 'no',
		'upload-report': {
			uploadedFiles: [
				{
					id: '5b857ec6-9317-4530-81c3-d4ed5994ade2',
					name: 'APP-Q9999-W-22-1234567-original_sparkling-enamel-pin-badge-gift-for-awesome-friends.jpg',
					fileName:
						'APP-Q9999-W-22-1234567-original_sparkling-enamel-pin-badge-gift-for-awesome-friends.jpg',
					originalFileName: 'original_sparkling-enamel-pin-badge-gift-for-awesome-friends.jpg',
					location:
						'has-questionnaire:APP_Q9999_W_22_1234567/5b857ec6-9317-4530-81c3-d4ed5994ade2/APP-Q9999-W-22-1234567-original_sparkling-enamel-pin-badge-gift-for-awesome-friends.jpg',
					size: '234337',
					message: {
						text: 'APP-Q9999-W-22-1234567-original_sparkling-enamel-pin-badge-gift-for-awesome-friends.jpg'
					}
				}
			]
		},
		'inspector-access-appeal-site': 'no',
		'inspector-visit-neighbour': 'no',
		'safety-risks': 'no',
		'safety-risks_new-safety-risk-value': '',
		'other-ongoing-appeals': 'no',
		'new-planning-conditions': 'no',
		'new-planning-conditions_new-conditions-value': ''
	},
	journeyId: 'has-questionnaire',
	referenceId: 'APP/Q9999/W/22/1234567',
	startDate: testDate,
	updateDate: testDate
};

const submittedQuestionnaireObjectPostMap = [
	{
		questionnaire: {
			LPACode: 'Q9999',
			caseReference: 'APP/Q9999/W/22/1234567',
			isAppealTypeAppropriate: true,
			doesTheDevelopmentAffectTheSettingOfAListedBuilding: false,
			affectedListedBuildings: undefined,
			inCAOrRelatesToCA: false,
			siteWithinGreenBelt: false,
			howYouNotifiedPeople: [],
			hasRepresentationsFromOtherParties: false,
			doesSiteHaveHealthAndSafetyIssues: false,
			healthAndSafetyIssuesDetails: undefined,
			doesSiteRequireInspectorAccess: false,
			doPlansAffectNeighbouringSite: false,
			hasExtraConditions: false,
			extraConditions: undefined,
			nearbyCaseReferences: undefined,
			documents: [
				{
					filename: 'APP-Q9999-W-22-1234567-Hero-shot-3.jpg',
					originalFilename: 'Hero-shot-3.jpg',
					size: '216963',
					mime: 'image/jpeg',
					documentURI:
						'http://blob-storage:10000/devstoreaccount1/uploads/has-questionnaire%3AAPP_Q9999_W_22_1234567/5b857ec6-9317-4530-81c3-d4ed5994ade2/APP-Q9999-W-22-1234567-original_sparkling-enamel-pin-badge-gift-for-awesome-friends.jpg',
					dateCreated: testDate,
					lastModified: testDate,
					documentType: undefined,
					sourceSystem: 'appeals',
					origin: 'citizen',
					stage: 'lpa_questionnaire'
				},

				{
					filename:
						'APP-Q9999-W-22-1234567-original_sparkling-enamel-pin-badge-gift-for-awesome-friends.jpg',
					originalFilename: 'original_sparkling-enamel-pin-badge-gift-for-awesome-friends.jpg',
					size: '234337',
					mime: 'image/jpeg',
					documentURI:
						'http://blob-storage:10000/devstoreaccount1/uploads/has-questionnaire%3AAPP_Q9999_W_22_1234567/5b857ec6-9317-4530-81c3-d4ed5994ade2/APP-Q9999-W-22-1234567-original_sparkling-enamel-pin-badge-gift-for-awesome-friends.jpg',
					dateCreated: testDate,
					lastModified: testDate,
					documentType: undefined,
					sourceSystem: 'appeals',
					origin: 'citizen',
					stage: 'lpa_questionnaire'
				}
			]
		}
	}
];

module.exports = {
	submittedQuestionnaireObjectPreMap,
	submittedQuestionnaireObjectPostMap,
	testDate
};
