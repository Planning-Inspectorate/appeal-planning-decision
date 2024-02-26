const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const { VIEW } = require('../../../lib/views');
const { determineUser } = require('../../../lib/determine-user');

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

	const viewContext = {
		titleSuffix: formatTitleSuffix(userType),
		appeal: {
			appealNumber,
			headlineData: 'this is it for now'
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
