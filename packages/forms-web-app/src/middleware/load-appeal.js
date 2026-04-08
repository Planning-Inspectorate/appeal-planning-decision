/**
 * Creates a middleware function to fetch appeal by caseRef, sets on req.appealCase, rendering 404 if not found
 * @param {Function} getAppealNumber - Function that extracts appeal number from request (e.g., req => req.params.appealNumber)
 * @param {import('../../../appeals-service-api/src/routes/v2/appeal-cases/service').AppealCaseSelect} [selectFields]
 * @returns {import('express').Handler}
 */
const loadAppeal = (getAppealNumber, selectFields) => async (req, res, next) => {
	try {
		const appealNumber = getAppealNumber(req);
		req.appealCase = await req.appealsApiClient.getAppealCaseByCaseRef(appealNumber, selectFields);
		next();
	} catch (error) {
		if (error?.code === 404) {
			res.status(404).render('error/not-found');
			return;
		} else {
			next(error);
		}
	}
};

module.exports = { loadAppeal };
