const OpenApiValidator = require('express-openapi-validator');
const ApiError = require('#errors/apiError');
const { BadRequest } = require('express-openapi-validator/dist/openapi.validator');
const { generateOpenApiSpec } = require('../spec/gen-api-spec');
const logger = require('#lib/logger.js');

/**
 * Create middleware to validate requests against the OpenApi spec
 *
 * @returns {import('express-openapi-validator/dist/framework/types').OpenApiRequestHandler[]}
 */
function openApiValidatorMiddleware() {
	const spec = generateOpenApiSpec();

	return OpenApiValidator.middleware({
		apiSpec: spec,
		validateApiSpec: true,
		validateRequests: true,
		ignoreUndocumented: true
	});
}

/**
 * Error handler for OpenAPI Validation errors - maps to an ApiError
 *
 * @type {import('express').ErrorRequestHandler}
 */
function openApiValidationErrorHandler(err, req, res, next) {
	logger.error(err);
	// handle validation errors
	if (err instanceof BadRequest) {
		throw ApiError.badRequest({ errors: err.errors.map((e) => e.message) });
	}
	next(err); // pass up the chain
}

module.exports = {
	openApiValidatorMiddleware,
	openApiValidationErrorHandler
};
