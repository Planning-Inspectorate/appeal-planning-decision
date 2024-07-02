const OpenApiValidator = require('express-openapi-validator');
const ApiError = require('#errors/apiError');
const { BadRequest } = require('express-openapi-validator/dist/openapi.validator');
const { generateOpenApiSpec } = require('../spec/gen-api-spec');
const logger = require('#lib/logger');

/**
 * Create middleware to validate requests against the OpenApi spec
 *
 * @returns {import('express-openapi-validator/dist/framework/types').OpenApiRequestHandler[]}
 */
function openApiValidatorMiddleware(arg) {
	const spec = generateOpenApiSpec();

	console.log(arg);

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
	// handle validation errors
	if (err instanceof BadRequest) {
		throw ApiError.badRequest({ errors: err.errors.map((e) => e.message) });
	}
	logger.error(err);
	next(err); // pass up the chain
}

module.exports = {
	openApiValidatorMiddleware,
	openApiValidationErrorHandler
};
