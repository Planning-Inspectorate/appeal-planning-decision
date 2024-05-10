const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { formatHeadlineData, formatRows, formatDocumentDetails } = require('@pins/common');

const { VIEW } = require('../../../lib/views');
const { apiClient } = require('../../../lib/appeals-api-client');
const { determineUser } = require('../../../lib/determine-user');
const { getUserFromSession } = require('../../../services/user.service');
const { detailsRows } = require('./appeal-details-rows');
const { documentsRows } = require('./appeal-documents-rows');

/**
 * Shared controller for /appeals/:caseRef/appeal-details, manage-appeals/:caseRef/appeal-details rule-6-appeals/:caseRef/appeal-details
 * @param {string} layoutTemplate - njk template to extend
 * @returns {import('express').RequestHandler}
 */
exports.get = (layoutTemplate = 'layouts/no-banner-link/main.njk') => {
	return async (req, res) => {
		const appealNumber = req.params.appealNumber;
		const userRouteUrl = req.originalUrl;

		// determine user based on route to selected appeal
		// i.e '/appeals/' = appellant | agent
		// todo: use oauth token
		const userType = determineUser(userRouteUrl);

		if (userType === null) {
			throw new Error('Unknown role');
		}

		const userEmail = getUserFromSession(req).email;

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

		const appealDetailsRows = retrieveDetailsRowsForUser(caseData, userType);
		const appealDetails = formatRows(appealDetailsRows, caseData);

		const appealDocumentsRows = retrieveDocumentsRowsForUser(caseData, userType);
		const appealDocuments = formatRows(appealDocumentsRows, caseData);

		const viewContext = {
			layoutTemplate,
			titleSuffix: formatTitleSuffix(userType),
			appealDetailsSuffix: formatDetailsSuffix(userType),
			appeal: {
				appealNumber,
				headlineData,
				appealDetails,
				appealDocuments
			}
		};

		res.render(VIEW.SELECTED_APPEAL.APPEAL_DETAILS, viewContext);
	};
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

/**
 * @param {import('appeals-service-api/src/spec/api-types').AppealCaseWithAppellant} caseData
 * @param {string} userType
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */

const retrieveDetailsRowsForUser = (caseData, userType) => {
	const rows = detailsRows(caseData);

	if (userType === (APPEAL_USER_ROLES.APPELLANT || APPEAL_USER_ROLES.AGENT)) {
		rows.push({
			keyText: 'Award of costs',
			valueText: 'Yes',
			condition: (caseData) => caseData.costsAppliedForIndicator
		});
	}

	return rows;
};

/**
 * @param {import('appeals-service-api/src/spec/api-types').AppealCaseWithAppellant} caseData
 * @param {string} userType
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */

const retrieveDocumentsRowsForUser = (caseData, userType) => {
	const rows = documentsRows(caseData);

	const documents = caseData.Documents || [];

	if (userType === (APPEAL_USER_ROLES.APPELLANT || APPEAL_USER_ROLES.AGENT)) {
		rows.push({
			keyText: 'Costs application',
			valueText: formatDocumentDetails(documents, 'costsApplication'),
			condition: (caseData) => caseData
		});
	}

	return rows;
};
