class HasQuestionnaireMapper {
	mapToPINSDataModel(journeyResponse) {
		return [
			{
				questionnaire: {
					LPACode: journeyResponse.LPACode,
					caseReference: journeyResponse.caseReference,
					isAppealTypeAppropriate: this.#convertToBoolean(
						journeyResponse.answers['correct-appeal-type']
					),
					doesTheDevelopmentAffectTheSettingOfAListedBuilding: this.#convertToBoolean(
						journeyResponse.answers['affects-listed-building']
					),
					affectedListedBuildings: () => {
						if (journeyResponse.answers['affects-listed-building'].value == 'yes') {
							return this.#convertFrommAddMore(journeyResponse.answers['listed-building-number']);
						}
					},
					siteWithinGreenBelt: this.#convertToBoolean(journeyResponse.answers['green-belt']),
					howYouNotifiedPeople: journeyResponse.answers['notification-method'],
					doesSiteHaveHealthAndSafetyIssues: this.#convertToBoolean(
						journeyResponse.answers['safety-risks']
					),
					healthAndSafetyIssuesDetails: () => {
						if (journeyResponse.answers['safety-risks'].value == 'yes') {
							// todo use conditonal field from ongoing work
							return journeyResponse.answers['affects-listed-building'];
						}
					},
					doesSiteRequireInspectorAccess: this.#convertToBoolean(
						journeyResponse.answers['inspector-visit-appellant']
					),
					// todo waititng on odw
					//journeyResponse.answers['inspector-visit-neighbour'] - should this be housed in the same property as above possibly doNeightboursAffectNeighboringSite
					// newPlanningConditions: journeyResponse.answers['new-planning-conditions'],
					// todo this is with odw
					// journeyResponse.answers['other-ongoing-appeals'] // fieldname needs clarifying
					nearbyCaseReferences: () => {
						if (journeyResponse.answers['other-ongoing-appeals'].value == 'yes') {
							return this.#convertFrommAddMore(journeyResponse.answers['other-appeal-reference']);
						}
					},
					documents: [
						{
							notifyingParties: journeyResponse.answers['notified-who']
						},
						{
							conservationAreaMap: () => {
								if (journeyResponse.answers['conservation-area'].value == 'yes') {
									journeyResponse.answers['conservation-upload'];
								}
							}
						},
						{
							siteNotices: () => {
								if (journeyResponse.answers['display-site-notice'].value == 'yes') {
									journeyResponse.answers['upload-site-notice'];
								}
							}
						},
						{
							notifyingParties: () => {
								if (journeyResponse.answers['letters-to-neighbours'].value == 'yes') {
									journeyResponse.answers['upload-letters-emails'];
								}
							}
						},
						{
							pressAdvert: () => {
								if (journeyResponse.answers['press-advert'].value == 'yes') {
									journeyResponse.answers['upload-press-advert'];
								}
							}
						},
						{
							representations: () => {
								if (journeyResponse.answers['representations-other-parties'].value == 'yes') {
									journeyResponse.answers['upload-representations'];
								}
							}
						},
						{
							officersReport: journeyResponse.answers['upload-report']
						}
					]
				}
			}
		];
	}

	#convertToBoolean(value) {
		return value == 'yes' ? true : value == 'no' ? false : null;
	}

	#convertFrommAddMore(values) {
		let sanitisedValues = [];
		values.forEach((item) => {
			let sanitisedValue = item.value;
			sanitisedValues.push(sanitisedValue);
		});
		return sanitisedValues;
	}
}

module.exports = { HasQuestionnaireMapper };
