/**
 * Local Planning Authorities
 *
 * LPA List comes from Open Geography Portal - the BFC list
 * @link https://geoportal.statistics.gov.uk/datasets/local-planning-authorities-april-2020-uk-bfc
 *
 * Trialist LPAs is our own data
 */
const LpaService = require('../services/lpa.service');
const lpaService = new LpaService();

const get = async (req, res) => {
	req.log.info(req.params.id, 'Retrieving LPA');

	let lpa = {};

	lpa = await lpaService.getLpaById(req.params.id);

	if (lpa) {
		res.send(lpa.toJson());
	} else {
		req.log.debug(req.params.id, 'No LPA found');
	}
};

const getBylpaCode = async (req, res) => {
	req.log.info(req.params.lpaCode, 'Retrieving LPA');

	let lpa = {};

	lpa = await lpaService.getLpaByCode(req.params.lpaCode);

	if (lpa) {
		res.send(lpa.toJson());
	} else {
		req.log.debug(req.params.lpaCode, 'No LPA found');
	}
};

const list = async (req, res) => {
	const { name } = req.query;

	const filter = {};
	if (name) {
		filter.name = new RegExp(name, 'i');
	}
	const data = await lpaService.getLpaList();

	const output = {
		data,
		page: 1,
		limit: data.length,
		totalPages: 1,
		totalResult: data.length
	};

	res.json(output);
};

const create = async (req, res) => {
	const lpaList = await lpaService.createLpaList(req.body);
	res.status(200).json(lpaList);
};

module.exports = {
	get,
	getBylpaCode,
	list,
	create
};
