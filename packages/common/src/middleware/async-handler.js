/**
 * Wrap route handlers in the following function to handle async errors
 * express doesn't natively handle async handlers, so next isn't called, and the request hangs
 * @template T
 * @param {import('express').RequestHandler<T>| function(): Promise<void>} requestHandler
 * @returns {import('express').RequestHandler<T>}
 */
const asyncHandler = (requestHandler) => {
	return (request, response, next) => {
		try {
			const p = requestHandler(request, response, next);
			if (p instanceof Promise) {
				p.catch((e) => {
					console.error(e);
					next(e);
				});
			}
		} catch (e) {
			// in case a sync function is passed in
			next(e);
		}
	};
};

module.exports = asyncHandler;
