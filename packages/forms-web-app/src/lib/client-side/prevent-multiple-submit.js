function initialisePreventMultipleSubmit(document) {
	let hasBeenSubmitted = false;

	window.addEventListener('pageshow', () => {
		return (hasBeenSubmitted = false);
	});

	document.addEventListener('submit', (evt) => {
		if (hasBeenSubmitted) {
			evt.preventDefault();
		} else {
			hasBeenSubmitted = true;
		}
	});
}

module.exports = {
	initialisePreventMultipleSubmit
};
