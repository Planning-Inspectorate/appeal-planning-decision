const { getAppealStatus } = require('#utils/appeal-status');
const { formatCommentDeadlineText } = require('../../../../../utils/format-deadline-text');
const { formatCommentDecidedData } = require('../../../../../utils/format-comment-decided-data');
const { formatCommentHeadlineText } = require('../../../../../utils/format-headline-text');
const { formatCommentInquiryText } = require('../../../../../utils/format-comment-inquiry-text');
const { formatCommentHearingText } = require('../../../../../utils/format-comment-hearing-text');
const { formatHeadlineData } = require('@pins/common');
const { getDepartmentFromCode } = require('../../../../../services/department.service');
const {
	createInterestedPartySession
} = require('../../../../../services/interested-party.service');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { isChildLinkedAppeal } = require('@pins/common/src/lib/linked-appeals');

const decisionDocumentTypes = [
	APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_DECISION_LETTER,
	APPEAL_DOCUMENT_TYPE.LPA_COSTS_DECISION_LETTER,
	APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER
];

/** @type {import('express').Handler} */
const selectedAppeal = async (req, res) => {
	/** @type {import('appeals-service-api').Api.AppealCaseDetailed} */
	const appeal = req.appealCase;

	createInterestedPartySession(req, appeal.caseReference, appeal.siteAddressPostcode);

	const lpa = await getDepartmentFromCode(appeal.LPACode);
	const headlineData = formatHeadlineData({ caseData: appeal, lpaName: lpa.name });

	const status = getAppealStatus(appeal);

	const headlineText = formatCommentHeadlineText(appeal.caseReference, status);

	const deadlineText = formatCommentDeadlineText(appeal, status);

	const unfilteredDecisionDocuments = isChildLinkedAppeal(appeal)
		? await req.appealsApiClient.getDocumentsByCaseRef(
				// @ts-ignore
				appeal.linkedCases[0]?.leadCaseReference,
				decisionDocumentTypes
			)
		: appeal.Documents;

	const decidedData = formatCommentDecidedData(appeal, unfilteredDecisionDocuments);

	const inquiries = appeal.Events ? formatCommentInquiryText(appeal.Events) : [];
	const hearings = appeal.Events ? formatCommentHearingText(appeal.Events, appeal.caseStatus) : [];

	res.render(`comment-planning-appeal/appeals/_appealNumber/index`, {
		appeal: {
			...appeal,
			status,
			headlineText,
			deadlineText,
			decidedData,
			inquiries,
			hearings
		},
		headlineData
	});
};

module.exports = { selectedAppeal };
