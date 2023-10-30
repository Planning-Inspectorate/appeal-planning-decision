class HasQuestionnaireMapper {
	mapToPINSDataModel(journeyResponse) {
		return [
			{
				questionnaire: {
					LPACode: journeyResponse.LPACode,
					caseReference: journeyResponse.referenceId,
					isAppealTypeAppropriate: this.#convertToBoolean(
						journeyResponse.answers['correct-appeal-type']
					),
					doesTheDevelopmentAffectTheSettingOfAListedBuilding: this.#convertToBoolean(
						journeyResponse.answers['affects-listed-building']
					),
					affectedListedBuildings:
						journeyResponse.answers['affects-listed-building'] == 'yes'
							? this.#convertFromAddMore(journeyResponse.answers['add-listed-buildings'])
							: undefined,
					inCAOrRelatesToCA: this.#convertToBoolean(journeyResponse.answers['conservation-area']),
					siteWithinGreenBelt: this.#convertToBoolean(journeyResponse.answers['green-belt']),
					howYouNotifiedPeople: this.#howYouNotifiedPeople(journeyResponse),
					hasRepresentationsFromOtherParties: this.#convertToBoolean(
						journeyResponse.answers['representations-other-parties']
					),
					doesSiteHaveHealthAndSafetyIssues: this.#convertToBoolean(
						journeyResponse.answers['safety-risks']
					),
					healthAndSafetyIssuesDetails:
						journeyResponse.answers['safety-risks'] == 'yes'
							? journeyResponse.answers['safety-risks_new-safety-risk-value']
							: undefined,
					doesSiteRequireInspectorAccess: this.#convertToBoolean(
						journeyResponse.answers['inspector-access-appeal-site']
					),
					doPlansAffectNeighbouringSite: this.#convertToBoolean(
						journeyResponse.answers['inspector-visit-neighbour']
					),
					hasExtraConditions: this.#convertToBoolean(
						journeyResponse.answers['new-planning-conditions']
					),
					extraConditions:
						journeyResponse.answers['new-planning-conditions'] == 'yes'
							? journeyResponse.answers['safety-risks_new-conditions-value']
							: undefined,
					// todo waititng on odw
					//journeyResponse.answers['inspector-visit-neighbour'] - should this be housed in the same property as above possibly doNeightboursAffectNeighboringSite
					// newPlanningConditions: journeyResponse.answers['new-planning-conditions'],
					// todo this is with odw
					// journeyResponse.answers['other-ongoing-appeals'] // fieldname needs clarifying
					nearbyCaseReferences:
						journeyResponse.answers['other-ongoing-appeals'] == 'yes'
							? this.#convertFromAddMore(journeyResponse.answers['other-appeals-references'])
							: undefined,
					// todo we need to fix the formatting on these and there is technical debt in order to collect the correct metadata, commenting out for now as BO are not yet ready for this
					documents: [
						// {
						// notifyingParties: journeyResponse.answers['notified-who']
						// },
						// {
						// conservationAreaMap: () => {
						// if (journeyResponse.answers['conservation-area'].value == 'yes') {
						// journeyResponse.answers['conservation-upload'];
						// }
						// }
						// },
						// {
						// siteNotices: () => {
						// if (journeyResponse.answers['display-site-notice'].value == 'yes') {
						// journeyResponse.answers['upload-site-notice'];
						// }
						// }
						// },
						// {
						// notifyingParties: () => {
						// if (journeyResponse.answers['letters-to-neighbours'].value == 'yes') {
						// journeyResponse.answers['upload-letters-emails'];
						// }
						// }
						// },
						// {
						// pressAdvert: () => {
						// if (journeyResponse.answers['press-advert'].value == 'yes') {
						// journeyResponse.answers['upload-press-advert'];
						// }
						// }
						// },
						// {
						// representations: () => {
						// if (journeyResponse.answers['representations-other-parties'].value == 'yes') {
						// journeyResponse.answers['upload-representations'];
						// }
						// }
						// },
						// {
						// officersReport: journeyResponse.answers['upload-report']
						// }
					]
				}
			}
		];
	}

	#convertToBoolean(value) {
		return value == 'yes' ? true : value == 'no' ? false : null;
	}

	#convertFromAddMore(values) {
		let sanitisedValues = [];
		values.forEach((item) => {
			let sanitisedValue = item.value;
			sanitisedValues.push(sanitisedValue);
		});
		return sanitisedValues;
	}

	#howYouNotifiedPeople(journeyResponse) {
		let notifiedPeople = [];
		if (journeyResponse.answers['display-site-notice'] == 'yes') {
			notifiedPeople.push('A public notice at the site');
		}
		if (journeyResponse.answers['letters-to-neighbours'] == 'yes') {
			notifiedPeople.push('Letters to neighbours');
		}
		if (journeyResponse.answers['press-advert'] == 'yes') {
			notifiedPeople.push('Advert in the local press');
		}
		return notifiedPeople;
	}
}

module.exports = { HasQuestionnaireMapper };
