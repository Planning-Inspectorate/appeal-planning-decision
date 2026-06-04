const { formatHeadlineData } = require('@pins/common');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const logger = require('#lib/logger');
const {
	VIEW: {
		SELECTED_APPEAL: { APPEAL_COSTS: costsView }
	}
} = require('#lib/views');
const { formatDocumentLink } = require('#lib/representation-functions');
const { formatTitleSuffix } = require('#lib/selected-appeal-page-setup');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { getParentPathLink } = require('#lib/get-user-back-links');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');

/**
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef {import('@pins/common/src/constants').LpaUserRole} LpaUserRole
 */

/**
 * @typedef {Object} CostsParams
 * @property {AppealToUserRoles|LpaUserRole} userType // the user
 * @property {string} costsType //
 * @property {AppealToUserRoles|LpaUserRole} submittingParty  // the party submitting the representation
 * @property {boolean | null} [rule6OwnRepresentations] // optional param passed when a rule 6 party is viewing own (true) or other rule 6 party (false) reps
 */

/**
 * Shared controller for costs
 * @param {CostsParams} costsParams
 * @param {string} layoutTemplate - njk template to extend
 * @returns {import('express').RequestHandler}
 */
exports.get = (costsParams, layoutTemplate = 'layouts/no-banner-link/main.njk') => {
	return async (req, res) => {
		const appealNumber = req.params.appealNumber;

		const { userType, costsType } = costsParams;

		if (!userType) {
			throw new Error(`Unknown role: ${userType}`);
		}

		const caseData = await req.appealsApiClient.getAppealCaseWithCostsByType(appealNumber, [
			costsType
		]);

		if (caseData.Documents.length === 0) {
			logger.error(`No costs documents found: ${userType}|${costsType}`);
			return res.status(404).render('error/not-found');
		}

		const backToAppealOverviewLink = getParentPathLink(req.originalUrl);
		const lpa = await getDepartmentFromCode(caseData.LPACode);
		const headlineData = formatHeadlineData({ caseData, lpaName: lpa.name, role: userType });

		/** @type {string} */
		let costsTypeName = '';

		const isLpa = userType === LPA_USER_ROLE;

		switch (costsType) {
			case APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_APPLICATION:
				costsTypeName = isLpa ? 'Appellant costs applications' : 'Your costs applications';
				break;
			case APPEAL_DOCUMENT_TYPE.LPA_COSTS_APPLICATION:
				costsTypeName = isLpa
					? 'Your costs applications'
					: 'Local planning authority costs applications';
				break;
			case APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_CORRESPONDENCE:
				costsTypeName = isLpa ? 'Appellant costs comments' : 'Your costs comments';
				break;
			case APPEAL_DOCUMENT_TYPE.LPA_COSTS_CORRESPONDENCE:
				costsTypeName = isLpa ? 'Your costs comments' : 'Local planning authority costs comments';
				break;
			default:
				throw new Error(`Unknown costs type: ${costsType}`);
		}

		const formattedDocumentLinks = caseData.Documents.map((doc) => formatDocumentLink(doc));

		const viewContext = {
			layoutTemplate,
			backToAppealOverviewLink,
			titleSuffix: formatTitleSuffix(userType),
			heading: costsTypeName,
			appeal: {
				appealNumber,
				headlineData,
				documents: formattedDocumentLinks
			}
		};

		res.render(costsView, viewContext);
	};
};
