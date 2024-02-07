const { VIEW } = require('../../lib/views');

exports.get = (req, res) => {
	const appealNumber = req.params.appealNumber;

	// type
	// procedure
	// site
	// applicant
	// application number

	const viewContext = {
		appeal: {
			appealNumber: appealNumber
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
};
