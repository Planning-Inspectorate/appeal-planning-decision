const { formatHeadlineData } = require('@pins/common');
const { VIEW } = require('../../../lib/views');
const { formatTitleSuffix } = require('../../../lib/selected-appeal-page-setup');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { REPRESENTATION_TYPES, APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const {
	filterRepresentationsBySubmittingParty,
	formatRepresentationHeading,
	formatRepresentations,
	filterRepresentationsForRule6ViewingRule6
} = require('../../../lib/representation-functions');
const { getServiceUserId } = require('../../../services/user.service');

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
 * @property {RepresentationTypes} representationType // Statement, Final Comment, IP Comments, Proofs of Evidence
 * @property {AppealToUserRoles|LpaUserRole} submittingParty  // the party submitting the representation
 * @property {boolean | null} [rule6OwnRepresentations] // optional param
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

		const { userType, representationType, submittingParty, rule6OwnRepresentations } =
			representationParams;

		// Retrieves an AppealCase with an array of Representations of the specified type
		const caseData = await req.appealsApiClient.getAppealCaseWithRepresentationsByType(
			appealNumber,
			representationType
		);

		// Don't need to filter by submitting party for IP comments as all submitted by IPs (who may not have a service user id)
		let representationsForDisplay;

		if (representationType == REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT) {
			representationsForDisplay = caseData.Representations;
		} else if (
			userType == APPEAL_USER_ROLES.RULE_6_PARTY &&
			submittingParty == APPEAL_USER_ROLES.RULE_6_PARTY
		) {
			const serviceUserId = getServiceUserId(req);
			representationsForDisplay = filterRepresentationsForRule6ViewingRule6(
				caseData,
				serviceUserId,
				!!rule6OwnRepresentations
			);
		} else {
			representationsForDisplay = filterRepresentationsBySubmittingParty(caseData, submittingParty);
		}

		const lpa = await getDepartmentFromCode(caseData.LPACode);
		const headlineData = formatHeadlineData(caseData, lpa.name, userType);

		const formattedRepresentations = formatRepresentations(representationsForDisplay);

		const representationView =
			representationType == REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT
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
