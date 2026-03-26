const { getLPA, getLPAById } = require('../../../lib/appeals-api-wrapper');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const { formatAddress } = require('@pins/common/src/lib/format-address');
const { formatApplicant } = require('@pins/common/src/lib/format-applicant');
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

	if (
		appealTypeCode === CASE_TYPES.ENFORCEMENT.processCode ||
		appealTypeCode === CASE_TYPES.ENFORCEMENT_LISTED.processCode
	) {
		return formatEnforcementBeforeYouStartSection(appellantSubmission, lpa);
	}

	const appealType = appealTypeCode === 'S78' ? 'Full planning' : CASE_TYPES[appealTypeCode].type;

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
 * @param {import('appeals-service-api').Api.AppellantSubmission} appellantSubmission
 * @param {{name: string}} lpa
 * @returns
 */

const formatEnforcementBeforeYouStartSection = (appellantSubmission, lpa) => {
	const {
		appealTypeCode,
		enforcementIssueDate,
		enforcementEffectiveDate,
		hasContactedPlanningInspectorate,
		contactPlanningInspectorateDate,
		enforcementReferenceNumber
	} = appellantSubmission;

	const appealType = CASE_TYPES[appealTypeCode].type;

	const isEnforcementListed = appealTypeCode === CASE_TYPES.ENFORCEMENT_LISTED.processCode;

	const issueDate = formatDateForDisplay(enforcementIssueDate, { format: 'd MMMM yyyy' });

	const effectiveDate = formatDateForDisplay(enforcementEffectiveDate, { format: 'd MMMM yyyy' });

	const contactDate = formatDateForDisplay(contactPlanningInspectorateDate, {
		format: 'd MMMM yyyy'
	});

	const rows = [
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
				text: 'Is your enforcement notice about a listed building?',
				classes: 'govuk-!-width-one-half'
			},
			value: {
				html: isEnforcementListed ? 'Yes' : 'No'
			}
		},
		{
			key: {
				text: 'What is the issue date on your enforcement notice?',
				classes: 'govuk-!-width-one-half'
			},
			value: {
				html: issueDate
			}
		},
		{
			key: {
				text: 'What is the effective date on your enforcement notice?',
				classes: 'govuk-!-width-one-half'
			},
			value: {
				html: effectiveDate
			}
		}
	];

	if (hasContactedPlanningInspectorate) {
		rows.push({
			key: {
				text: 'Did you contact the Planning Inspectorate to tell them you will appeal the enforcement notice?',
				classes: 'govuk-!-width-one-half'
			},
			value: {
				html: 'Yes'
			}
		});
	}

	if (contactPlanningInspectorateDate) {
		rows.push({
			key: {
				text: 'When did you contact the Planning Inspectorate?',
				classes: 'govuk-!-width-one-half'
			},
			value: {
				html: contactDate
			}
		});
	}

	rows.push({
		key: {
			text: 'What is the reference number on the enforcement notice?',
			classes: 'govuk-!-width-one-half'
		},
		value: {
			html: enforcementReferenceNumber
		}
	});

	return {
		heading: 'Before you start',
		list: {
			rows
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
	const appealType = appealTypeCode === 'S78' ? 'Full planning' : CASE_TYPES[appealTypeCode].type;
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
