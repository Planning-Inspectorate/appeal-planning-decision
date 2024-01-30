const { VIEW } = require('../../lib/views');

exports.get = (req, res) => {
	const appealNumber = req.params.appealNumber;

	const viewContext = {
		appeal: {
			appealNumber: appealNumber
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
};
