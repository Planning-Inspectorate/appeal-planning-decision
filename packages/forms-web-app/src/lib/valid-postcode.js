// todo: use tested postcode regex common/src/regex.js
// todo(journey-refactor): inject the regex?
const validatePostcode = (postcode, errorMessage = 'Enter a full UK postcode') => {
	const pattern =
		/([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2})/;
	const result = pattern.exec(postcode);
	if (!result) {
		throw new Error(errorMessage);
	}
	return postcode;
};

module.exports = validatePostcode;
