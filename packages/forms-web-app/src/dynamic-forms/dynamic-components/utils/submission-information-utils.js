const { format: formatDate } = require('date-fns');
const { APPEALS_CASE_DATA } = require('@pins/common/src/constants');
const typeCodeToSubmissionInformationString = {
	[APPEALS_CASE_DATA.APPEAL_TYPE_CODE.HAS]: 'Householder',
	[APPEALS_CASE_DATA.APPEAL_TYPE_CODE.S78]: 'Full planning'
};

exports.formatBeforeYouStartSection = (journeyResponse) => {
	const lpa = journeyResponse.LPACode;

	const appealType = typeCodeToSubmissionInformationString[journeyResponse.answers.appealTypeCode];

	const decisionDate = formatDate(
		new Date(journeyResponse.answers.applicationDecisionDate),
		'd MMMM yyyy'
	);

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
						html: lpa
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

exports.formatSubmissionDate = () => {
	return formatDate(new Date(), 'd MMMM yyyy');
};
