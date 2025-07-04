exports.dateInputsToDate = (dayInput, monthInput, yearInput) => {
	const day = `0${dayInput}`.slice(-2);
	const month = `0${monthInput}`.slice(-2);
	const year = yearInput;

	const dateInput = `${year}-${month}-${day}`;

	return new Date(dateInput);
};
