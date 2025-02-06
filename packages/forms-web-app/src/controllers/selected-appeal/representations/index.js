const { formatHeadlineData } = require('@pins/common');
const { VIEW } = require('../../../lib/views');
const { formatTitleSuffix } = require('../../../lib/selected-appeal-page-setup');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { REPRESENTATION_TYPES, APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const {
	formatRepresentationHeading,
	filterRepresentationsForDisplay,
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
 * @property {RepresentationTypes} representationType // Statement, Final Comment, IP Comments, Proofs of Evidence
 * @property {AppealToUserRoles|LpaUserRole} submittingParty  // the party submitting the representation
 * @property {boolean | null} [rule6OwnRepresentations] // optional param passed when a rule 6 party is viewing own (true) or other rule 6 party (false) reps
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
		// Representations will have a 'userOwnsRepresentation' field
		const caseData = await req.appealsApiClient.getAppealCaseWithRepresentationsByType(
			appealNumber,
			representationType
		);

		const representationsForDisplay = filterRepresentationsForDisplay(
			caseData,
			representationParams
		);

		const lpa = await getDepartmentFromCode(caseData.LPACode);
		const headlineData = formatHeadlineData(caseData, lpa.name, userType);

		const formattedRepresentations = await formatRepresentations(representationsForDisplay, req);

		const representationView =
			representationType == REPRESENTATION_TYPES.INTERESTED_PARTY_COMMENT
				? VIEW.SELECTED_APPEAL.APPEAL_IP_COMMENTS
				: VIEW.SELECTED_APPEAL.APPEAL_REPRESENTATIONS;

		const showLabel =
			userType == APPEAL_USER_ROLES.RULE_6_PARTY &&
			submittingParty == APPEAL_USER_ROLES.RULE_6_PARTY
				? !rule6OwnRepresentations
				: formattedRepresentations.length > 1;

		const viewContext = {
			layoutTemplate,
			titleSuffix: formatTitleSuffix(userType),
			heading: formatRepresentationHeading(representationParams),
			showLabel,
			appeal: {
				appealNumber,
				headlineData,
				representations: formattedRepresentations
			}
		};

		res.render(representationView, viewContext);
	};
};
