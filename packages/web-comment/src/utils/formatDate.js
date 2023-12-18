module.exports = {
	/**
	 * @param {string} inputDate
	 * @returns {string}
	 */
	formatDate: (inputDate) => {
		const date = new Date(inputDate);
		const options = { day: 'numeric', month: 'short', year: 'numeric' };
		return new Intl.DateTimeFormat('en-GB', options).format(date);
	}
};
