const ApiError = require('../apiError');

class HorizonCreateOrganisationRequestError extends ApiError {
	constructor() {
		super(504, `Horizon returned a bad response when we attempted to create an organisation`);
	}
}

module.exports = HorizonCreateOrganisationRequestError;
