function formatNumber(number) {
	const numberFormatter = new Intl.NumberFormat('en-GB');
	return numberFormatter.format(number);
}

module.exports = formatNumber;
