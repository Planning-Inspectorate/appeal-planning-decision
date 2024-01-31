const { VIEW } = require('../../lib/views');

exports.getFirewallError = (_, res) => {
	res.render(VIEW.ERROR_PAGES.FIREWALL_ERROR, {
		currentUrl: '/firewall-error',
		nextPage: {
			text: 'Firewall error',
			url: '/firewall-error'
		},
		title: 'Error: Firewall error - Appeal a planning decision - GOV.UK'
	});
};
