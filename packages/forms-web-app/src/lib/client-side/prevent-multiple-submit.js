function initialisePreventMultipleSubmit(document) {
	let hasBeenSubmitted = false;

	document.addEventListener('submit', function (evt) {
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
