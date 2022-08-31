/**
 * Local Planning Authorities
 *
 * LPA List comes from Open Geography Portal - the BFC list
 * @link https://geoportal.statistics.gov.uk/datasets/local-planning-authorities-april-2020-uk-bfc
 *
 * Trialist LPAs is our own data
 */

const LPASchema = require('../schemas/lpa');
const { getLpaList, createLpaList } = require('../services/lpa.service');

module.exports = {
	async get(req, res, next) {
		const { id } = req.params;

		req.log.info({ id }, 'Retrieving LPA');

		const data = await LPASchema.findOne({
			id: new RegExp(id, 'i')
		});

		if (!data) {
			req.log.debug({ id }, 'No LPA found');
			next();
			return;
		}

		res.send(data);
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
		await createLpaList(req.body);
		res.status(200).send('');
	}
};
