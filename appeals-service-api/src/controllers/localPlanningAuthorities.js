/**
 * Local Planning Authorities
 *
 * LPA List comes from Open Geography Portal - the BFC list
 * @link https://geoportal.statistics.gov.uk/datasets/local-planning-authorities-april-2020-uk-bfc
 *
 * Trialist LPAs is our own data
 */

const LPASchema = require('../schemas/lpa');

module.exports = {
  async get(req, res, next) {
    const id = req.param('id');

    req.log.info({ id }, 'Retrieving LPA');

    /* Make code case-insensitive */
    const data = await LPASchema.findOne({
      id: new RegExp(id, 'i'),
    });

    if (!data) {
      req.log.debug({ id }, 'No LPA found');
      next();
      return;
    }

    res.send(data);
  },

  async list(req, res) {
    const name = req.param('name');

    const filter = {};
    if (name) {
      filter.name = new RegExp(name, 'i');
    }

    const data = await LPASchema.find(filter);

    /* Use a paginated output in case we wish to put data into database in future */
    const output = {
      data,
      count: data.length, // total per page
      total: data.length, // overall total
      page: 1,
      pageCount: 1,
    };

    res.send(output);
  },
};
