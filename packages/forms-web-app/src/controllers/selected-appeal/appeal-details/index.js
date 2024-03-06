const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { formatHeadlineData, formatRows } = require('@pins/common');

const { VIEW } = require('../../../lib/views');
const { apiClient } = require('../../../lib/appeals-api-client');
const { determineUser } = require('../../../lib/determine-user');
const { rows } = require('./appeal-details-rows');
const { getLPAUserFromSession } = require('../../../services/lpa-user.service');

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

	const userEmail =
		userType === LPA_USER_ROLE ? getLPAUserFromSession(req).email : req.session.email;

	if (!userEmail) {
		throw new Error('no session email');
	}

	const user = await apiClient.getUserByEmailV2(userEmail);

	const caseData = await apiClient.getUsersAppealCase({
		caseReference: appealNumber,
		role: userType,
		userId: user.id
	});

	const headlineData = formatHeadlineData(caseData, userType);
	const appealDetailsRows = rows(caseData);

	const appealDetails = formatRows(appealDetailsRows, caseData);

	const viewContext = {
		titleSuffix: formatTitleSuffix(userType),
		appealDetailsSuffix: formatDetailsSuffix(userType),
		appeal: {
			appealNumber,
			headlineData,
			appealDetails
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL_DETAILS, viewContext);
};

/**
 * @param {string} userType
 * @returns {string}
 */
const formatTitleSuffix = (userType) => {
	if (userType === LPA_USER_ROLE) return 'Manage your appeals';
	return 'Appeal a planning decision';
};

/**
 * @param {string} userType
 * @returns {string}
 */
const formatDetailsSuffix = (userType) => {
	if (userType === (APPEAL_USER_ROLES.APPELLANT || APPEAL_USER_ROLES.AGENT)) {
		return 'Your';
	}
	return "Appellant's";
};
