const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const { formatHeadlineData, formatQuestionnaireRows } = require('@pins/common');

const { VIEW } = require('#lib/views');
const { determineUser } = require('#lib/determine-user');
const { getParentPathLink } = require('../../../lib/get-user-back-links');
const {
	formatQuestionnaireHeading,
	formatTitleSuffix
} = require('#lib/selected-appeal-page-setup');
const { constraintsRows } = require('./constraints-details-rows');
const { appealProcessRows } = require('./appeal-process-details-rows');
const { consultationRows } = require('./consultation-details-rows');
const { environmentalRows } = require('./environmental-details-rows');
const { notifiedRows } = require('./notified-details-rows');
const { planningOfficerReportRows } = require('./planning-officer-details-rows');
const { siteAccessRows } = require('./site-access-details-rows');
const { lpaQuestionnaireValidationRows } = require('./lpa-questionnaire-validation-details-rows');
const { getUserFromSession } = require('../../../services/user.service');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { addCSStoHtml } = require('#lib/add-css-to-html');
const { generatePDF } = require('#lib/pdf-api-wrapper');
const { APPEAL_CASE_STAGE } = require('@planning-inspectorate/data-model');

/**
 * Shared controller for /appeals/:caseRef/appeal-details, manage-appeals/:caseRef/appeal-details rule-6-appeals/:caseRef/appeal-details
 * @param {string} layoutTemplate - njk template to extend
 * @returns {import('express').RequestHandler}
 */
exports.get = (layoutTemplate = 'layouts/no-banner-link/main.njk') => {
	return async (req, res) => {
		const appealNumber = req.params.appealNumber;
		const trailingSlashRegex = /\/$/;
		const userRouteUrl = req.originalUrl.replace(trailingSlashRegex, '').split('?')[0];
		const backToAppealOverviewLink = getParentPathLink(userRouteUrl);

		// determine user based on route to selected appeal
		//i.e '/appeals/' = appellant | agent
		const userType = determineUser(userRouteUrl);

		if (userType === null) {
			throw new Error('Unknown role');
		}

		const isPagePdfDownload = req.query.pdf === 'true' && userType === LPA_USER_ROLE;

		let pdfDownloadUrl;
		let zipDownloadUrl;
		if (userType === LPA_USER_ROLE && !isPagePdfDownload) {
			pdfDownloadUrl = userRouteUrl + '?pdf=true';
			zipDownloadUrl =
				req.originalUrl.substring(0, req.originalUrl.lastIndexOf('/')) +
				`/download/back-office/documents/${APPEAL_CASE_STAGE.LPA_QUESTIONNAIRE}`;
		}

		const loggedInUser = getUserFromSession(req);

		if (!loggedInUser.email) {
			throw new Error('no session email');
		}

		const user = await req.appealsApiClient.getUserByEmailV2(loggedInUser.email);

		const caseData = await req.appealsApiClient.getUsersAppealCase({
			caseReference: appealNumber,
			role: userType,
			userId: user.id
		});
		const lpa = await getDepartmentFromCode(caseData.LPACode);

		if (!caseData.lpaQuestionnairePublishedDate && userType !== LPA_USER_ROLE) {
			throw new Error("can't show an unpublished lpaq");
		}

		// headline data
		const headlineData = formatHeadlineData({ caseData, lpaName: lpa.name, role: userType });
		// constraints details
		const constraintsDetailsRows = constraintsRows(caseData);
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
		// lpa questionnaire validation rows
		const lpaQuestionnaireValidationDetailsRows = lpaQuestionnaireValidationRows({
			caseData,
			userType: userType
		});
		const lpaQuestionnaireValidationDetails = formatQuestionnaireRows(
			lpaQuestionnaireValidationDetailsRows,
			caseData
		);

		const viewContext = {
			layoutTemplate,
			backToAppealOverviewLink,
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
				appealProcessDetails,
				lpaQuestionnaireValidationDetails
			},
			pdfDownloadUrl,
			zipDownloadUrl
		};

		await res.render(VIEW.SELECTED_APPEAL.APPEAL_QUESTIONNAIRE, viewContext, async (_, html) => {
			if (!isPagePdfDownload) return res.send(html);
			const pdfHtml = await addCSStoHtml(html);
			const pdf = await generatePDF(pdfHtml);

			res.set(
				'Content-disposition',
				`attachment; filename="Appeal Questionnaire ${appealNumber}.pdf"`
			);
			res.set('Content-type', 'application/pdf');
			return res.send(pdf);
		});
	};
};
