const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const { formatHeadlineData, formatQuestionnaireRows } = require('@pins/common');

const { VIEW } = require('../../../lib/views');
const { apiClient } = require('../../../lib/appeals-api-client');
const { determineUser } = require('../../../lib/determine-user');
const {
	formatQuestionnaireHeading,
	formatTitleSuffix,
	determineServicePage
} = require('../../../lib/selected-appeal-page-setup');
const { constraintsRows, environmentalRows } = require('./questionnaire-details-rows');

/**
 * @type {import('express').Handler}
 */
exports.get = async (req, res) => {
	const appealNumber = req.params.appealNumber;
	const userRouteUrl = req.originalUrl;

	// determine user based on route to selected appeal
	//i.e '/appeals/' = appellant | agent
	const userType = determineUser(userRouteUrl);

	if (userType === null) {
		throw new Error('Unknown role');
	}

	const userEmail = userType === LPA_USER_ROLE ? req.session.lpaUser?.email : req.session.email;

	if (!userEmail) {
		throw new Error('no session email');
	}

	const user = await apiClient.getUserByEmailV2(userEmail);

	const caseData = await apiClient.getUsersAppealCase({
		caseReference: appealNumber,
		role: userType,
		userId: user.id
	});

	// headline data
	const headlineData = formatHeadlineData(caseData, userType);
	// constraints details
	const constraintsDetailsRows = constraintsRows(caseData);
	const constraintsDetails = formatQuestionnaireRows(constraintsDetailsRows, caseData);
	// environmental rows
	const environmentalDetailsRows = environmentalRows(caseData);
	const environmentalDetails = formatQuestionnaireRows(environmentalDetailsRows, caseData);

	const viewContext = {
		servicePage: determineServicePage(userType),
		titleSuffix: formatTitleSuffix(userType),
		mainHeading: formatQuestionnaireHeading(userType),
		appeal: {
			appealNumber,
			headlineData,
			constraintsDetails,
			environmentalDetails
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL_QUESTIONNAIRE, viewContext);
};
