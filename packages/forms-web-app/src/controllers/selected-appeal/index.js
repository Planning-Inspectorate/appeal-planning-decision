const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const {
	formatSections,
	formatSiteVisits,
	formatInquiries,
	isSection,
	displayHeadlinesByUser
} = require('@pins/common');
const {
	shouldDisplayQuestionnaireDueNotification,
	shouldDisplayStatementsDueBannerLPA,
	shouldDisplayStatementsDueBannerRule6,
	shouldDisplayFinalCommentsDueBannerLPA,
	shouldDisplayFinalCommentsDueBannerAppellant,
	shouldDisplayProofEvidenceDueBannerAppellant,
	shouldDisplayProofEvidenceDueBannerLPA,
	shouldDisplayProofEvidenceDueBannerRule6
} = require('./action-banners');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');
const { VIEW } = require('../../lib/views');
const { determineUser } = require('../../lib/determine-user');
const { sections: appellantSections } = require('./appellant-sections');
const { sections: lpaUserSections } = require('./lpa-user-sections');
const { mapDecisionTag } = require('@pins/business-rules/src/utils/decision-outcome');
const { sections: rule6Sections } = require('./rule-6-sections');
const { getUserFromSession } = require('../../services/user.service');
const { formatInTimeZone } = require('date-fns-tz');
const targetTimezone = 'Europe/London';
const { getDepartmentFromCode } = require('../../services/department.service');
const logger = require('#lib/logger');

/** @type {import('@pins/common/src/view-model-maps/sections/def').UserSectionsDict} */
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

		// determine user based on route to selected appeal
		// i.e '/appeals/' = appellant | agent
		// todo: use oauth token
		const userType = determineUser(userRouteUrl);

		if (userType === null) {
			throw new Error('Unknown role');
		}

		const userEmail = getUserFromSession(req).email;

		if (!userEmail) {
			throw new Error('no session email');
		}

		const user = await req.appealsApiClient.getUserByEmailV2(userEmail);

		let [caseData, events] = await Promise.all([
			req.appealsApiClient.getUsersAppealCase({
				caseReference: appealNumber,
				role: userType,
				userId: user.id
			}),
			req.appealsApiClient.getEventsByCaseRef(appealNumber, { includePast: true })
		]);

		events?.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

		const lpa = await getDepartmentFromCode(caseData.LPACode);
		const headlineData = displayHeadlinesByUser(caseData, lpa.name, userType);

		const sections = userSectionsDict[userType];
		if (!isSection(sections)) throw new Error(`No sections configured for user type ${userType}`);

		const viewContext = {
			layoutTemplate,
			titleSuffix: formatTitleSuffix(userType),
			shouldDisplayQuestionnaireDueNotification: shouldDisplayQuestionnaireDueNotification(
				caseData,
				userType
			),
			shouldDisplayStatementsDueBannerLPA: shouldDisplayStatementsDueBannerLPA(caseData, userType),
			shouldDisplayStatementsDueBannerRule6: shouldDisplayStatementsDueBannerRule6(
				caseData,
				userType
			),
			shouldDisplayFinalCommentsDueBannerLPA: shouldDisplayFinalCommentsDueBannerLPA(
				caseData,
				userType
			),
			shouldDisplayFinalCommentsDueBannerAppellant: shouldDisplayFinalCommentsDueBannerAppellant(
				caseData,
				userType
			),
			shouldDisplayProofEvidenceDueBannerLPA: shouldDisplayProofEvidenceDueBannerLPA(
				caseData,
				userType
			),
			shouldDisplayProofEvidenceDueBannerAppellant: shouldDisplayProofEvidenceDueBannerAppellant(
				caseData,
				userType
			),
			shouldDisplayProofEvidenceDueBannerRule6: shouldDisplayProofEvidenceDueBannerRule6(
				caseData,
				userType
			),
			appeal: {
				appealNumber,
				headlineData,
				siteVisits: formatSiteVisits(events, userType),
				inquiries: formatInquiries(events, userType),
				sections: formatSections({ caseData, sections, userEmail }),
				baseUrl: userRouteUrl,
				decision: mapDecisionTag(caseData.caseDecisionOutcome),
				decisionDocuments: filterDecisionDocuments(caseData.Documents),
				lpaQuestionnaireDueDate: formatDateForNotification(caseData.lpaQuestionnaireDueDate),
				statementDueDate: formatDateForNotification(caseData.statementDueDate),
				rule6StatementDueDate: formatDateForNotification(caseData.rule6StatementDueDate),
				finalCommentDueDate: formatDateForNotification(caseData.finalCommentsDueDate),
				proofEvidenceDueDate: formatDateForNotification(caseData.proofsOfEvidenceDueDate),
				rule6ProofEvidenceDueDate: formatDateForNotification(caseData.rule6ProofEvidenceDueDate)
			}
		};

		logger.debug({ viewContext }, 'viewContext');

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
	documents.filter(
		(document) => document.documentType === APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER
	);

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
