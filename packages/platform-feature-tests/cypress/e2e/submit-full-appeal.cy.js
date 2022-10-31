const { submitAppealFlow } = require('../support/flows/appeal');

describe('Appeal uploads', () => {
	[
		// ['refused', 'written', 'finalised'],
		['no decision', 'hearing', 'in draft']
	].forEach((context) => {
		it(`sends a householder planning application successfully to Horizon where the original application status is "${context[0]}", the decision type requested is "${context[1]}" and the planning obligation status is "${context[2]}"`, () => {
			submitAppealFlow({
				statusOfOriginalApplication: context[0],
				typeOfDecisionRequested: context[1],
				statusOfPlanningObligation: context[2]
			});

			// TODO: code out what we think should be done in order for Horizon to check outcome
		});
	});
});
