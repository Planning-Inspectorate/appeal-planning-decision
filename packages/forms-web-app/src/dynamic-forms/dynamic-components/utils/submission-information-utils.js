const { getLPA, getLPAById } = require('../../../lib/appeals-api-wrapper');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const { formatAddress } = require('@pins/common/src/lib/format-address');
const { formatApplicant } = require('@pins/common/src/lib/format-applicant');
const typeCodeToSubmissionInformationString = {
	[CASE_TYPES.HAS.processCode]: 'Householder',
	[CASE_TYPES.S78.processCode]: 'Full planning'
};
const { formatDateForDisplay } = require('@pins/common/src/lib/format-date');

/**
 *
 * @param {import('appeals-service-api').Api.AppellantSubmission} appellantSubmission
 * @returns
 */

exports.formatBeforeYouStartSection = async (appellantSubmission) => {
	const { LPACode, appealTypeCode, applicationDecisionDate } = appellantSubmission;

	let lpa;
	try {
		lpa = await getLPA(LPACode);
	} catch (err) {
		lpa = await getLPAById(LPACode);
	}

	const appealType = typeCodeToSubmissionInformationString[appealTypeCode];

	const decisionDate = formatDateForDisplay(applicationDecisionDate, { format: 'd MMMM yyyy' });

	return {
		heading: 'Before you start',
		list: {
			rows: [
				{
					key: {
						text: 'Local planning authority',
						classes: 'govuk-!-width-one-half'
					},
					value: {
						html: lpa.name
					}
				},
				{
					key: {
						text: 'Appeal type',
						classes: 'govuk-!-width-one-half'
					},
					value: {
						html: appealType
					}
				},
				{
					key: {
						text: 'Decision date',
						classes: 'govuk-!-width-one-half'
					},
					value: {
						html: decisionDate
					}
				}
			]
		}
	};
};

/**
 *
 * @param {import('appeals-service-api').Api.AppealCaseDetailed} appeal
 * @param {import('@pins/common/src/constants').LpaUserRole|null}role
 * @returns
 */

exports.formatQuestionnaireAppealInformationSection = (appeal, role) => {
	const { appealTypeCode } = appeal;
	const appealType = typeCodeToSubmissionInformationString[appealTypeCode];
	const address = formatAddress(appeal);
	const applicant = formatApplicant(appeal.users, role);

	return {
		list: {
			rows: [
				{
					key: {
						text: 'Appeal type',
						classes: 'govuk-!-width-one-half'
					},
					value: {
						html: appealType
					}
				},
				{
					key: {
						text: 'Appeal site',
						classes: 'govuk-!-width-one-half'
					},
					value: {
						html: address
					}
				},
				{
					key: {
						...applicant.key,
						classes: 'govuk-!-width-one-half'
					},
					value: applicant.value
				},
				{
					key: {
						text: 'Application number',
						classes: 'govuk-!-width-one-half'
					},
					value: {
						html: appeal.applicationReference
					}
				}
			]
		}
	};
};
