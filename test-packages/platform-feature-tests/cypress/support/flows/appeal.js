const initialiseFullAppeal = require('./sections/initialiseFullAppeal');
const applicationNameSection = require('./sections/applicationNameSection'); 
const completeContactDetailsSection = require('./sections/completeContactDetailsSection');
const completeAppealSiteSection = require('./sections/completeAppealSiteSection');
const completeAppealDecisionTypeSection = require('./sections/completeAppealDecisionTypeSection');
const completeUploadPlanningApplicationDocumentsSection = require('./sections/completeUploadPlanningApplicationDocumentsSection');
const completeUploadAppealDocumentsSection = require('./sections/completeUploadAppealDocumentsSection');
const completeCheckAnswersAndSubmitSection = require('./sections/completeCheckAnswersAndSubmitSection');

function submitAppealFlow(appealOptions) {
	const { statusOfOriginalApplication, typeOfDecisionRequested, statusOfPlanningObligation, planning } =
		appealOptions;

	if (['granted', 'refused', 'no decision'].includes(statusOfOriginalApplication) == false) {
		throw new Error(
			`The status of original application "${statusOfOriginalApplication}" is not supported!`
		);
	}

	if (['written', 'hearing', 'enquiry'].includes(typeOfDecisionRequested) == false) {
		throw new Error(
			`The stype of decision requested "${typeOfDecisionRequested}" is not supported!`
		);
	}

	if (['not started', 'finalised', 'in draft'].includes(statusOfPlanningObligation) == false) {
		throw new Error(
			`The status of planning obligation "${statusOfPlanningObligation}" is not supported!`
		);
	}

	initialiseFullAppeal(statusOfOriginalApplication,planning);
	// applicationNameSection();
	// completeContactDetailsSection();
	// completeAppealSiteSection();
	// completeAppealDecisionTypeSection(typeOfDecisionRequested);
	// completeUploadPlanningApplicationDocumentsSection(statusOfOriginalApplication);
	// completeUploadAppealDocumentsSection(statusOfPlanningObligation);
	// completeCheckAnswersAndSubmitSection();
}

module.exports = {
	submitAppealFlow
};
