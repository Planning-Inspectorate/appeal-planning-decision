/** @type {(journeys: import('../journeys').Journeys) => import('express').Handler} */
exports.getJourney = (journeys) => (_, res, next) => {
	const journey = journeys.getJourney(res.locals.journeyResponse);
	res.locals.journey = journey;
	next();
};
