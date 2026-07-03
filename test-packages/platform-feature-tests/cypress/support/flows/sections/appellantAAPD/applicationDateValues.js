import { DateService } from "../../../../utils/dateService";

const getApplicationDateValues = (isExpedited) => {
	const date = new DateService();

	if (isExpedited) {
		return {
			day: date.today(),
			month: date.currentMonth(),
			year: date.currentYear()
		};
	}

	// Non-expedited journeys must use an application date before 1 April 2026.
	return {
		day: 30,
		month: 3,
		year: 2026
	};
};

module.exports = { getApplicationDateValues };
