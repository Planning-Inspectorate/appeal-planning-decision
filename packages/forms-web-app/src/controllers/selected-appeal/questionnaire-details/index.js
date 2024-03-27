const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const { formatHeadlineData, formatQuestionnaireRows } = require('@pins/common');

const { VIEW } = require('../../../lib/views');
const { apiClient } = require('../../../lib/appeals-api-client');
const { determineUser } = require('../../../lib/determine-user');
const {
	formatQuestionnaireHeading,
	formatTitleSuffix
} = require('../../../lib/selected-appeal-page-setup');
const { constraintsRows } = require('./constraints-details-rows');
const { appealProcessRows } = require('./appeal-process-details-rows');
const { consultationRows } = require('./consultation-details-rows');
const { environmentalRows } = require('./environmental-details-rows');
const { notifiedRows } = require('./notified-details-rows');
const { planningOfficerReportRows } = require('./planning-officer-details-rows');
const { siteAccessRows } = require('./site-access-details-rows');

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
		const constraintsDetailsRows = constraintsRows(caseData, userType);
		const constraintsDetails = formatQuestionnaireRows(constraintsDetailsRows, caseData);
		// environmental rows
		const environmentalDetailsRows = environmentalRows(caseData);
		const environmentalDetails = formatQuestionnaireRows(environmentalDetailsRows, caseData);
		// notified rows
		const notifiedDetailsRows = notifiedRows(caseData);
		const notifiedDetails = formatQuestionnaireRows(notifiedDetailsRows, caseData);
		// consultation rows
		const consultationDetailsRows = consultationRows(caseData);
		const consultationDetails = formatQuestionnaireRows(consultationDetailsRows, caseData);
		// planning officer report rows
		const planningOfficerDetailsRows = planningOfficerReportRows(caseData);
		const planningOfficerDetails = formatQuestionnaireRows(planningOfficerDetailsRows, caseData);
		// site access rows
		const siteAccessDetailsRows = siteAccessRows(caseData);
		const siteAccessDetails = formatQuestionnaireRows(siteAccessDetailsRows, caseData);
		// appeal process rows
		const appealProcessDetailsRows = appealProcessRows(caseData);
		const appealProcessDetails = formatQuestionnaireRows(appealProcessDetailsRows, caseData);

		const viewContext = {
			layoutTemplate,
			titleSuffix: formatTitleSuffix(userType),
			mainHeading: formatQuestionnaireHeading(userType),
			appeal: {
				appealNumber,
				headlineData,
				constraintsDetails,
				environmentalDetails,
				notifiedDetails,
				consultationDetails,
				planningOfficerDetails,
				siteAccessDetails,
				appealProcessDetails
			}
		};

		res.render(VIEW.SELECTED_APPEAL.APPEAL_QUESTIONNAIRE, viewContext);
	};
};
