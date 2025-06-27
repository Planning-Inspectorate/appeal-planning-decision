const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const { format } = require('date-fns');
const {
	VIEW: {
		FULL_APPEAL: { DECLARATION_INFORMATION: currentPage }
	}
} = require('../../../lib/full-appeal/views');
const logger = require('../../../lib/logger');

const getDeclarationInformation = async (req, res) => {
	const { appeal, appealLPD } = req.session;

	const { appealId } = req.params;
	const log = logger.child({ appealId, uuid: uuid.v4() });

	if (!appealId) {
		const message = 'The appealId should be provided in the request param.';
		res.status(400);
		log.debug(message);

		return res.render('error/400', {
			message
		});
	}

	log.debug('Get declaration information');

	if (!appeal) {
		res.status(404);
		log.debug(`The appeal ${appealId} was not found`);
		return res.render('error/not-found');
	}

	if (!appealLPD) {
		const message = 'Unable to locate the Local Planning Department for the given LPA Code.';
		res.status(400);
		log.debug(message);

		return res.render('error/400', {
			message
		});
	}

	const css = fs.readFileSync(
		path.resolve(__dirname, '../../../public/stylesheets/main.min.css'),
		'utf8'
	);

	if (!appeal.submissionDate) {
		log.debug(`The submission date default value is set`);
		appeal.submissionDate = format(new Date(), 'd MMMM yyyy');
	}

	return res.render(currentPage, {
		appealLPD: appealLPD.name,
		appeal,
		css,
		displayCookieBanner: false
	});
};

module.exports = {
	getDeclarationInformation
};
