/**
 * Local Planning Authorities
 *
 * LPA List comes from Open Geography Portal - the BFC list
 * @link https://geoportal.statistics.gov.uk/datasets/local-planning-authorities-april-2020-uk-bfc
 *
 * Trialist LPAs is our own data
 */
const { getLpaList, createLpaList, getLpaById } = require('../services/lpa.service');

module.exports = {
	async get(req, res) {
		req.log.info(req.params.id, 'Retrieving LPA');
		const lpa = await getLpaById(req.params.id);

		if (lpa) {
			res.send(lpa);
		} else {
			req.log.debug(req.params.id, 'No LPA found');
		}
	},

	async list(req, res) {
		const { name } = req.query;

		const filter = {};
		if (name) {
			filter.name = new RegExp(name, 'i');
		}

		const data = await getLpaList();

		const output = {
			data,
			page: 1,
			limit: data.length,
			totalPages: 1,
			totalResult: data.length
		};

		res.send(output);
	},

	async create(req, res) {
		const lpaList = await createLpaList(req.body);
		res.status(200).send(lpaList);
	}
};
