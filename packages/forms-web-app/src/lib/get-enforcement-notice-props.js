const { format, parseISO, subDays, addDays } = require('date-fns');
const { getDepartmentFromId } = require('../services/department.service');
const { boolToYesNo } = require('@pins/common');
const formatDate = require('./format-date-check-your-answers');

const nextPageUrl = '/enforcement/enforcement-reference-number';

const getEnforcementNoticeProps = async (appeal) => {
	let appealLPD = '';

	if (appeal.lpaCode) {
		const lpd = await getDepartmentFromId(appeal.lpaCode);
		if (lpd) {
			appealLPD = lpd.name;
		}
	}

	const effectiveDate = parseISO(appeal.eligibility.enforcementEffectiveDate);

	const enforcementNotice = appeal.eligibility.enforcementNotice ? 'Yes' : 'No';

	const enforcementNoticeListedBuilding = appeal.eligibility.enforcementNoticeListedBuilding
		? 'Yes'
		: 'No';

	const enforcementIssueDate = format(
		parseISO(appeal.eligibility.enforcementIssueDate),
		'd MMMM yyyy'
	);

	const enforcementEffectiveDate = format(effectiveDate, 'd MMMM yyyy');

	const contactedPlanningInspectorate = appeal.eligibility.hasContactedPlanningInspectorate != null;

	const deadlineDate = contactedPlanningInspectorate
		? formatDate(addDays(effectiveDate, 6))
		: formatDate(subDays(effectiveDate, 1));

	const hasContactedPlanningInspectorate = contactedPlanningInspectorate
		? boolToYesNo(appeal.eligibility.hasContactedPlanningInspectorate)
		: null;

	const contactedPlanningInspectorateDate = contactedPlanningInspectorate
		? format(parseISO(appeal.eligibility.contactPlanningInspectorateDate), 'd MMMM yyyy')
		: null;

	return {
		appealLPD,
		enforcementNotice,
		enforcementNoticeListedBuilding,
		enforcementIssueDate,
		enforcementEffectiveDate,
		contactedPlanningInspectorate,
		hasContactedPlanningInspectorate,
		contactedPlanningInspectorateDate,
		nextPageUrl,
		deadlineDate
	};
};

module.exports = { getEnforcementNoticeProps };
