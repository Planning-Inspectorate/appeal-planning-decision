const { formatHeadlineData } = require('@pins/common');
const { VIEW } = require('../../../lib/views');
const { formatTitleSuffix } = require('../../../lib/selected-appeal-page-setup');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { REPRESENTATION_TYPES } = require('@pins/common/src/constants');
const {
	filterRepresentationsBySubmittingParty,
	formatRepresentationHeading,
	formatRepresentations
} = require('../../../lib/representation-functions');

/**
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef {import('@pins/common/src/constants').LpaUserRole} LpaUserRole
 * @typedef {import('@pins/common/src/constants').RepresentationTypes} RepresentationTypes
 */

/**
 * @param {string} url
 * @returns {AppealToUserRoles|LpaUserRole|null}
 */

/**
 * @typedef {Object} RepresentationParams
 * @property {AppealToUserRoles|LpaUserRole} userType // the user
 * @property {RepresentationTypes} representationType //
 * @property {AppealToUserRoles|LpaUserRole} submittingParty  // the party submitting the representation
 */

/**
 * Shared controller for /appeals/:caseRef/lpa-statement, /manage-appeals/:caseRef/statement
 * @param {RepresentationParams} representationParams
 * @param {string} layoutTemplate - njk template to extend
 * @returns {import('express').RequestHandler}
 */
exports.get = (representationParams, layoutTemplate = 'layouts/no-banner-link/main.njk') => {
	return async (req, res) => {
		const appealNumber = req.params.appealNumber;

		const { userType, representationType, submittingParty } = representationParams;

		// Retrieves an AppealCase with an array of Representations of the specified type
		const caseData = await req.appealsApiClient.getAppealCaseWithRepresentationsByType(
			appealNumber,
			representationType
		);

		const representationsForDisplay =
			representationType == REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT
				? caseData.Representations
				: filterRepresentationsBySubmittingParty(caseData, submittingParty);

		const lpa = await getDepartmentFromCode(caseData.LPACode);
		const headlineData = formatHeadlineData(caseData, lpa.name, userType);

		const formattedRepresentations = formatRepresentations(representationsForDisplay);

		const representationView = REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT
			? VIEW.SELECTED_APPEAL.APPEAL_IP_COMMENTS
			: VIEW.SELECTED_APPEAL.APPEAL_REPRESENTATIONS;

		const viewContext = {
			layoutTemplate,
			titleSuffix: formatTitleSuffix(userType),
			heading: formatRepresentationHeading(representationType, userType, submittingParty),

			appeal: {
				appealNumber,
				headlineData,
				representations: formattedRepresentations
			}
		};

		res.render(representationView, viewContext);
	};
};
