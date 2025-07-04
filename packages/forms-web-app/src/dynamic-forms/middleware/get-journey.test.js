const { getJourney } = require('./get-journey');

describe('getJourney middleware', () => {
	it('should set res.locals.journey and call next', () => {
		const mockJourney = { id: 'abc' };
		const journeys = {
			getJourney: jest.fn().mockReturnValue(mockJourney)
		};
		const res = {
			locals: {
				journeyResponse: { foo: 'bar' }
			}
		};
		const next = jest.fn();

		const middleware = getJourney(journeys);
		middleware({}, res, next);

		expect(journeys.getJourney).toHaveBeenCalledWith(res.locals.journeyResponse);
		expect(res.locals.journey).toBe(mockJourney);
		expect(next).toHaveBeenCalled();
	});
});
