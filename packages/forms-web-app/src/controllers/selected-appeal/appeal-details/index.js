const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { formatHeadlineData, formatRows } = require('@pins/common');

const { VIEW } = require('#lib/views');
const { determineUser } = require('#lib/determine-user');
const { getParentPathLink } = require('../../../lib/get-user-back-links');
const { getUserFromSession } = require('../../../services/user.service');
const { detailsRows } = require('./appeal-details-rows');
const { documentsRows } = require('./appeal-documents-rows');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { generatePDF } = require('#lib/pdf-api-wrapper');
const { addCSStoHtml } = require('#lib/add-css-to-html');

const logger = require('#lib/logger');

/**
 * Shared controller for /appeals/:caseRef/appeal-details, manage-appeals/:caseRef/appeal-details rule-6-appeals/:caseRef/appeal-details
 * @param {string} layoutTemplate - njk template to extend
 * @returns {import('express').RequestHandler}
 */
exports.get = (layoutTemplate = 'layouts/no-banner-link/main.njk') => {
	return async (req, res) => {
		const appealNumber = req.params.appealNumber;
		const trailingSlashRegex = /\/$/;
		const userRouteUrl = req.originalUrl.replace(trailingSlashRegex, '');
		const backToAppealOverviewLink = getParentPathLink(userRouteUrl);

		// determine user based on route to selected appeal
		// i.e '/appeals/' = appellant | agent
		// todo: use oauth token
		const userType = determineUser(userRouteUrl);

		if (userType === null) {
			throw new Error('Unknown role');
		}

		const isPagePdfDownload = req.query.pdf === 'true' && userType === LPA_USER_ROLE;

		let pdfDownloadUrl;
		if (userType === LPA_USER_ROLE && !isPagePdfDownload) {
			pdfDownloadUrl = userRouteUrl + '?pdf=true';
		}

		const userEmail = getUserFromSession(req).email;

		if (!userEmail) {
			throw new Error('no session email');
		}

		const user = await req.appealsApiClient.getUserByEmailV2(userEmail);

		const caseData = await req.appealsApiClient.getUsersAppealCase({
			caseReference: appealNumber,
			role: userType,
			userId: user.id
		});

		if (!caseData.caseValidDate && userType !== APPEAL_USER_ROLES.APPELLANT) {
			throw new Error("can't show an unvalidated appeal");
		}

		logger.debug({ caseData }, 'caseData');

		const lpa = await getDepartmentFromCode(caseData.LPACode);
		const headlineData = formatHeadlineData(caseData, lpa.name, userType);

		const appealDetailsRows = detailsRows(caseData, userType);
		const appealDetails = formatRows(appealDetailsRows, caseData);

		const appealDocumentsRows = documentsRows(caseData);
		const appealDocuments = formatRows(appealDocumentsRows, caseData);

		const viewContext = {
			layoutTemplate,
			backToAppealOverviewLink,
			titleSuffix: formatTitleSuffix(userType),
			appealDetailsSuffix: formatDetailsSuffix(userType),
			appeal: {
				appealNumber,
				headlineData,
				appealDetails,
				appealDocuments
			},
			pdfDownloadUrl
		};

		await res.render(VIEW.SELECTED_APPEAL.APPEAL_DETAILS, viewContext, async (_, html) => {
			if (!isPagePdfDownload) return res.send(html);

			const pdfHtml = await addCSStoHtml(html);
			const pdf = await generatePDF(pdfHtml);

			res.set('Content-disposition', `attachment; filename="Appeal ${appealNumber}.pdf"`);
			res.set('Content-type', 'application/pdf');
			return res.send(pdf);
		});
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
