const {
	schemas: { validate }
} = require('../../business-rules/src');
const { isAppealSubmitted } = require('../../services/appeal.service');
const logger = require('../../lib/logger');
const ApiError = require('../../error/apiError');

const appealUpdateValidationRules = async (req, res, next) => {
	try {
		req.body = await validate.update(req.body);
		logger.debug('Valid input format');

		const appealId = req.body.id;
		const pathId = req.params.id;

		if (appealId && pathId !== appealId) {
			return next(ApiError.notSameId());
		}

		return next();
	} catch (err) {
		return next(ApiError.badRequest(err));
	}
};

const appealInsertValidationRules = async (req, res, next) => {
	try {
		// logger.debug(
		//   { appeal: req.body },
		//   'Appeal data before validation in appealInsertValidationRules'
		// );
		req.body = await validate.insert(req.body);
		// logger.debug(
		//   { appeal: req.body },
		//   'Appeal data after validation in appealInsertValidationRules'
		// );
		logger.debug('Valid input format');

		const appealId = req.body.id;
		const pathId = req.params.id;

		if (await isAppealSubmitted(appealId)) {
			logger.debug('Appeal is already submitted so end processing request with 409 response');
			return next(ApiError.appealAlreadySubmitted());
		}

		if (appealId && pathId !== appealId) {
			return next(ApiError.notSameId());
		}

		return next();
	} catch (err) {
		logger.debug(err);
		return next(ApiError.badRequest(err));
	}
};

module.exports = {
	appealUpdateValidationRules,
	appealInsertValidationRules
};
