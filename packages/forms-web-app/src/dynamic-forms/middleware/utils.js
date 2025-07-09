/**
 * Converts booleans in the LPAQuestionnaireSubmission db model into yes/no strings
 * @param {Record<any, any>} dbResponse
 */

function mapDBResponseToJourneyResponseFormat(dbResponse) {
	return Object.entries(dbResponse).reduce(
		(acc, [key, value]) => ({
			...acc,
			[key]: (() => {
				switch (value) {
					case true:
						return 'yes';
					case false:
						return 'no';
					default:
						return value;
				}
			})()
		}),
		{}
	);
}

module.exports = { mapDBResponseToJourneyResponseFormat };
