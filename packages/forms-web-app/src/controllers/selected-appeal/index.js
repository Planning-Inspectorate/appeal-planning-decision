const {
	APPEAL_DOCUMENT_TYPE
} = require('@planning-inspectorate/data-model');

const {
	isLPAQuestionnaireDue,
	isLPAStatementOpen,
	isRule6StatementOpen,
	isAppellantProofsOfEvidenceOpen,
	isLPAProofsOfEvidenceOpen,
	isRule6ProofsOfEvidenceOpen,
	isAppellantFinalCommentOpen,
	isLPAFinalCommentOpen
} = require('@pins/business-rules/src/rules/appeal-case/case-due-dates');

const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const {
	formatSections,
	formatSiteVisits,
	formatInquiries,
	formatHearings,
	isSection,
	displayHeadlinesByUser
} = require('@pins/common');

const { VIEW } = require('../../lib/views');
const { determineUser } = require('../../lib/determine-user');
const { getUserDashboardLink } = require('../../lib/get-user-back-links');
const { sections: appellantSections } = require('./appellant-sections');
const { sections: lpaUserSections } = require('./lpa-user-sections');
const { mapDecisionTag } = require('@pins/business-rules/src/utils/decision-outcome');
const { sections: rule6Sections } = require('./rule-6-sections');
const { formatInTimeZone } = require('date-fns-tz');
const targetTimezone = 'Europe/London';
const { getDepartmentFromCode } = require('../../services/department.service');
const logger = require('#lib/logger');
const config = require('../../config');
const { formatDateForDisplay } = require('@pins/common/src/lib/format-date');
const { formatDashboardLinkedCaseDetails } = require('#lib/linked-appeals');

/** @type {Partial<import('@pins/common/src/view-model-maps/sections/def').UserSectionsDict>} */
const userSectionsDict = {
	[APPEAL_USER_ROLES.APPELLANT]: appellantSections,
	[LPA_USER_ROLE]: lpaUserSections,
	[APPEAL_USER_ROLES.RULE_6_PARTY]: rule6Sections
};

/**
 * Shared controller for /appeals/:caseRef, manage-appeals/:caseRef rule-6-appeals/:caseRef
 * @param {string} layoutTemplate - njk template to extend
 * @returns {import('express').RequestHandler}
 */
exports.get = (layoutTemplate = 'layouts/no-banner-link/main.njk') => {
	return async (req, res) => {
		const appealNumber = req.params.appealNumber;
		const trailingSlashRegex = /\/$/;
		const userRouteUrl = req.originalUrl.replace(trailingSlashRegex, '');
		const backLinkToDashboard = getUserDashboardLink(userRouteUrl);

		// determine user based on route to selected appeal
		// i.e '/appeals/' = appellant | agent
		// todo: use oauth token
		const userType = determineUser(userRouteUrl);

		if (userType === null) {
			throw new Error('Unknown role');
		}

		const isLPA = userType === LPA_USER_ROLE;
		const isAppellant =
			userType === APPEAL_USER_ROLES.APPELLANT || userType === APPEAL_USER_ROLES.AGENT;
		const isRule6 = userType === APPEAL_USER_ROLES.RULE_6_PARTY;

		const [caseData, events] = await Promise.all([
			req.appealsApiClient.getAppealCaseWithRepresentations(appealNumber),
			req.appealsApiClient.getEventsByCaseRef(appealNumber, { includePast: true })
		]);

		events?.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

		const lpa = await getDepartmentFromCode(caseData.LPACode);
		const headlineData = displayHeadlinesByUser(caseData, lpa.name, userType);

		const linkedCaseDetails = formatDashboardLinkedCaseDetails(caseData);

		const sections = userSectionsDict[userType];
		if (!isSection(sections)) throw new Error(`No sections configured for user type ${userType}`);

		let bannerHtmlOverride;
		if (!isLPA) {
			bannerHtmlOverride =
				config.betaBannerText +
				config.generateBetaBannerFeedbackLink(
					config.getAppealTypeFeedbackUrl(caseData.appealTypeCode)
				);
		}

		const viewContext = {
			layoutTemplate,
			titleSuffix: formatTitleSuffix(userType),
			backLinkToDashboard,

			shouldDisplayQuestionnaireDueNotification:
				isLPA && isLPAQuestionnaireDue(caseData),
			shouldDisplayStatementsDueBannerLPA:  isLPA && isLPAStatementOpen(caseData),
			shouldDisplayProofEvidenceDueBannerLPA:
				isLPA && isLPAProofsOfEvidenceOpen(caseData),
			shouldDisplayFinalCommentsDueBannerLPA:
				isLPA && isLPAFinalCommentOpen(caseData),

			shouldDisplayProofEvidenceDueBannerAppellant:
				isAppellant && isAppellantProofsOfEvidenceOpen(caseData),
			shouldDisplayFinalCommentsDueBannerAppellant:
				isAppellant && isAppellantFinalCommentOpen(caseData),

			shouldDisplayStatementsDueBannerRule6: isRule6 && isRule6StatementOpen(caseData),
			shouldDisplayProofEvidenceDueBannerRule6: isRule6 && isRule6ProofsOfEvidenceOpen(caseData),

			appeal: {
				appealNumber,
				headlineData,
				siteVisits: formatSiteVisits(events, userType),
				inquiries: formatInquiries(events, userType),
				hearings: formatHearings(events, userType),
				sections: formatSections({ caseData, sections }),
				baseUrl: userRouteUrl,
				decision: mapDecisionTag(caseData.caseDecisionOutcome),
				decisionDate: formatDateForDisplay(caseData.caseDecisionOutcomeDate, {
					format: 'd MMMM yyyy'
				}),
				decisionDocuments: filterDecisionDocuments(caseData.Documents ?? []),
				lpaQuestionnaireDueDate: formatDateForNotification(caseData.lpaQuestionnaireDueDate),
				statementDueDate: formatDateForNotification(caseData.statementDueDate),
				rule6StatementDueDate: formatDateForNotification(caseData.statementDueDate),
				finalCommentDueDate: formatDateForNotification(caseData.finalCommentsDueDate),
				proofEvidenceDueDate: formatDateForNotification(caseData.proofsOfEvidenceDueDate),
				rule6ProofEvidenceDueDate: formatDateForNotification(caseData.proofsOfEvidenceDueDate),
				linkedCaseDetails
			},
			bannerHtmlOverride
		};

		logger.info({ viewContext }, 'viewContext');

		res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
	};
};

/**
 * @param {import('@pins/common/src/constants').AppealToUserRoles | "LPAUser" | null} userType
 * @returns {string}
 */
const formatTitleSuffix = (userType) => {
	if (userType === LPA_USER_ROLE) return 'Manage your appeals';
	return 'Appeal a planning decision';
};

/**
 * @param {import('appeals-service-api').Api.Document[]} documents
 * @return {import('appeals-service-api').Api.Document[]}
 */
const filterDecisionDocuments = (documents) =>
	documents.filter((document) => {
		if (
			document.documentType === APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER ||
			document.documentType === APPEAL_DOCUMENT_TYPE.LPA_COSTS_DECISION_LETTER ||
			document.documentType === APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_DECISION_LETTER
		) {
			return true;
		}
		return false;
	});

/**
 *
 * @param {string | undefined} dateStr
 * @returns {string | undefined}
 */
const formatDateForNotification = (dateStr) => {
	if (!dateStr) return;
	const date = new Date(dateStr);
	return `${formatInTimeZone(date, targetTimezone, 'h:mmaaa')} on ${formatInTimeZone(
		date,
		targetTimezone,
		'd LLLL yyyy'
	)}`; // eg 11:59pm on 21 March 2024
};
