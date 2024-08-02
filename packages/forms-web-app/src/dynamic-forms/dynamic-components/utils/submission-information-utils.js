const { format: formatDate } = require('date-fns');
const { getLPA, getLPAById } = require('../../../lib/appeals-api-wrapper');
const { APPEALS_CASE_DATA } = require('@pins/common/src/constants');
const typeCodeToSubmissionInformationString = {
	[APPEALS_CASE_DATA.APPEAL_TYPE_CODE.HAS]: 'Householder',
	[APPEALS_CASE_DATA.APPEAL_TYPE_CODE.S78]: 'Full planning'
};

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

	const decisionDate = formatDate(new Date(applicationDecisionDate), 'd MMMM yyyy');

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

exports.formattedSubmissionDate = () => {
	return formatDate(new Date(), 'd MMMM yyyy');
};
