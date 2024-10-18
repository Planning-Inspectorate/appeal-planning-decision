const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const { formatHeadlineData, formatQuestionnaireRows } = require('@pins/common');

const { VIEW } = require('#lib/views');
const { determineUser } = require('#lib/determine-user');
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
const { getUserFromSession } = require('../../../services/user.service');
const { getDepartmentFromCode } = require('../../../services/department.service');
const { addCSStoHtml } = require('#lib/add-css-to-html');
const { generatePDF } = require('#lib/pdf-api-wrapper');

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

		// determine user based on route to selected appeal
		//i.e '/appeals/' = appellant | agent
		const userType = determineUser(userRouteUrl);

		if (userType === null) {
			throw new Error('Unknown role');
		}

		const isPagePdfDownload = req.query.pdf === 'true' && userType === LPA_USER_ROLE;

		let pdfDownloadUrl;
		if (userType === LPA_USER_ROLE && !isPagePdfDownload) {
			pdfDownloadUrl = userRouteUrl + '?pdf=true';
		}

		const lpaUser = getUserFromSession(req);
		const userEmail = userType === LPA_USER_ROLE ? lpaUser?.email : req.session.email;

		if (!userEmail) {
			throw new Error('no session email');
		}

		const user = await req.appealsApiClient.getUserByEmailV2(userEmail);

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
		const headlineData = formatHeadlineData(caseData, lpa.name, userType);
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
			},
			pdfDownloadUrl
		};

		await req.app.render(
			VIEW.SELECTED_APPEAL.APPEAL_QUESTIONNAIRE,
			viewContext,
			async (_, html) => {
				if (!isPagePdfDownload) return res.send(html);

				const pdfHtml = await addCSStoHtml(html);
				const pdf = await generatePDF(pdfHtml);

				res.set(
					'Content-disposition',
					`attachment; filename="Appeal Questionnaire ${appealNumber}.pdf"`
				);
				res.set('Content-type', 'application/pdf');
				return res.send(pdf);
			}
		);
	};
};
