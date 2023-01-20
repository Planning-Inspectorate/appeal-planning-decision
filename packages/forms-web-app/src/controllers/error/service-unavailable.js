const { VIEW } = require('../../lib/views');

exports.getServiceUnavailable = (_, res) => {
	res.render(VIEW.ERROR_PAGES.SERVICE_UNAVAILABLE, {
		currentUrl: '/service-unavailable',
		nextPage: {
			text: 'Service unavailable',
			url: '/service-unavailable'
		},
		title: 'Error: Service unavailable - Appeal a planning decision - GOV.UK'
	});
};
