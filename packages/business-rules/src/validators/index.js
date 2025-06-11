const { isInThePast, isWithinDeadlinePeriod } = require('./appeal/decision-date');
const conditionalText = require('./common/conditional-text');
const { allOfValidOptions, allOfSelectedOptions, maybeOption } = require('./common/array');

module.exports = {
	appeal: {
		decisionDate: {
			isInThePast,
			isWithinDeadlinePeriod
		},
		conditionalText,
		allOfValidOptions,
		allOfSelectedOptions,
		maybeOption
	}
};
