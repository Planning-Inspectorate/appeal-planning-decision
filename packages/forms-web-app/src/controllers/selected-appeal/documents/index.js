const { formatHeadlineData } = require('@pins/common');
const logger = require('#lib/logger');
const {
	VIEW: {
		SELECTED_APPEAL: { APPEAL_DOCUMENTS: documentsView }
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
 * @typedef {Object} DocumentParams
 * @property {AppealToUserRoles|LpaUserRole} userType // the user
 * @property {string[]} documentTypes // list of docs to fetch
 * @property {string} displayName // name of the group of documents to display in the heading
 */

/**
 * Shared controller for costs
 * @param {DocumentParams} documentParams
 * @param {string} layoutTemplate - njk template to extend
 * @returns {import('express').RequestHandler}
 */
exports.get = (documentParams, layoutTemplate = 'layouts/no-banner-link/main.njk') => {
	return async (req, res) => {
		const appealNumber = req.params.appealNumber;

		const { userType, documentTypes, displayName } = documentParams;

		for (const documentType of documentTypes) {
			// @ts-expect-error
			if (!Object.values(APPEAL_DOCUMENT_TYPE).includes(documentType)) {
				throw new Error(`Unknown document type: ${documentType}`);
			}
		}

		if (!userType) {
			throw new Error(`Unknown role: ${userType}`);
		}

		await req.appealsApiClient.confirmUserHasAccessToAppealCase(appealNumber);
		const [caseData, documents] = await Promise.all([
			req.appealsApiClient.getAppealCaseByCaseRef(appealNumber),
			req.appealsApiClient.getDocumentsByCaseRef(appealNumber, documentTypes)
		]);

		if (documents.length === 0) {
			logger.error(`No documents found: ${userType}|${documentTypes.join(',')}`);
			return res.status(404).render('error/not-found');
		}

		const zipDownloadUrl =
			req.originalUrl.substring(0, req.originalUrl.lastIndexOf('/')) +
			`/download/back-office/documents?filter=${documentTypes}`;
		const backToAppealOverviewLink = getParentPathLink(req.originalUrl);
		const lpa = await getDepartmentFromCode(caseData.LPACode);
		const headlineData = formatHeadlineData({ caseData, lpaName: lpa.name, role: userType });

		const formattedDocumentLinks = documents.map((doc) => formatDocumentLink(doc));

		const viewContext = {
			layoutTemplate,
			backToAppealOverviewLink,
			titleSuffix: formatTitleSuffix(userType),
			heading: displayName,
			appeal: {
				appealNumber,
				headlineData,
				documents: formattedDocumentLinks
			},
			zipDownloadUrl,
			zipDownloadText: `Download all of your ${displayName.toLowerCase()} (ZIP)`
		};

		res.render(documentsView, viewContext);
	};
};
