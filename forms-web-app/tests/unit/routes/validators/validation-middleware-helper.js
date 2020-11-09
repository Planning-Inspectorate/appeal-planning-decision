exports.testExpressValidatorMiddleware = (req, res, middlewares) => {
  return Promise.all(middlewares.map((middleware) => middleware(req, res, () => undefined)));
};
