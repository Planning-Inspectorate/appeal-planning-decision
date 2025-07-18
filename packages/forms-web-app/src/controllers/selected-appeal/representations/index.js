const { formatHeadlineData } = require('@pins/common');
const { VIEW } = require('../../../lib/views');
const { formatTitleSuffix } = require('../../../lib/selected-appeal-page-setup');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { getParentPathLink } = require('../../../lib/get-user-back-links');
const {
	REPRESENTATION_TYPES,
	APPEAL_USER_ROLES,
	LPA_USER_ROLE
} = require('@pins/common/src/constants');
const {
	formatRepresentationHeading,
	filterRepresentationsForDisplay,
	formatRepresentations
} = require('../../../lib/representation-functions');
const { APPEAL_CASE_STAGE } = require('@planning-inspectorate/data-model');
const { addCSStoHtml } = require('#lib/add-css-to-html');
const { generatePDF } = require('#lib/pdf-api-wrapper');
const { documentTypes } = require('@pins/common');

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
		const trailingSlashRegex = /\/$/;
		const userRouteUrl = req.originalUrl.replace(trailingSlashRegex, '').split('?')[0];

		const { userType, representationType, submittingParty, rule6OwnRepresentations } =
			representationParams;

		if (userType === null) {
			throw new Error('Unknown role');
		}

		// Retrieves an AppealCase with an array of Representations of the specified type
		// Representations will have a 'userOwnsRepresentation' field
		const caseData = await req.appealsApiClient.getAppealCaseWithRepresentationsByType(
			appealNumber,
			representationType
		);

		const isPagePdfDownload =
			req.query.pdf === 'true' &&
			(userType === APPEAL_USER_ROLES.APPELLANT || userType === LPA_USER_ROLE);
		let pdfDownloadUrl;
		let zipDownloadUrl;
		const ipDocuments = caseData?.Documents?.filter(
			(doc) => doc.documentType === documentTypes.interestedPartyComment.name && doc.redacted
		);
		if (
			(userType === APPEAL_USER_ROLES.APPELLANT || userType === LPA_USER_ROLE) &&
			!isPagePdfDownload
		) {
			pdfDownloadUrl = userRouteUrl + '?pdf=true';
			if (ipDocuments?.length) {
				zipDownloadUrl =
					req.originalUrl.substring(0, req.originalUrl.lastIndexOf('/')) +
					`/download/back-office/documents/${APPEAL_CASE_STAGE.THIRD_PARTY_COMMENTS}`;
			}
		}

		const representationsForDisplay = filterRepresentationsForDisplay(
			caseData,
			representationParams
		);

		const backToAppealOverviewLink = getParentPathLink(req.originalUrl);

		const lpa = await getDepartmentFromCode(caseData.LPACode);
		const headlineData = formatHeadlineData(caseData, lpa.name, userType);
		const formattedRepresentations = formatRepresentations(caseData, representationsForDisplay);

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
			backToAppealOverviewLink,
			titleSuffix: formatTitleSuffix(userType),
			heading: formatRepresentationHeading(representationParams),
			showLabel,
			appeal: {
				appealNumber,
				headlineData,
				representations: formattedRepresentations
			},
			pdfDownloadUrl,
			zipDownloadUrl
		};

		await res.render(representationView, viewContext, async (_, html) => {
			if (!isPagePdfDownload) return res.send(html);

			const pdfHtml = await addCSStoHtml(html);
			const pdf = await generatePDF(pdfHtml);

			res.set(
				'Content-disposition',
				`attachment; filename="Appeal Interested Party Comments ${appealNumber}.pdf"`
			);
			res.set('Content-type', 'application/pdf');
			return res.send(pdf);
		});
	};
};
