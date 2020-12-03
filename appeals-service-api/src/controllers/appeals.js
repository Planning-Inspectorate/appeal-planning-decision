/**
 * appeals
 */

const AppealsSchema = require('../schemas/appeals');

module.exports = {
  async create(req, res) {
    const appeal = new AppealsSchema(req.body);

    appeal.generateUUID();

    try {
      await appeal.validate();
    } catch (err) {
      req.log.debug({ err, appeal }, 'Validation error');

      res.status(400).send(err);
      return;
    }

    await appeal.save();

    res.send(appeal);
  },

  async delete(req, res) {
    const uuid = req.param('uuid');

    req.log.info({ uuid }, 'Deleteing appeal');

    await AppealsSchema.deleteOne({
      uuid,
    });

    res.status(204).send();
  },

  async get(req, res) {
    const uuid = req.param('uuid');

    const appeal = await AppealsSchema.findOne({
      uuid,
    });

    if (!appeal) {
      req.log.debug('No appeal found');

      res.status(404).send();
      return;
    }

    res.send(appeal);
  },

  async list(req, res) {
    // @todo add pagination
    const data = await AppealsSchema.find();

    const output = {
      data,
      page: 1,
      limit: data.length, // total per page
      totalPages: 1,
      totalResult: data.length, // overall total
    };
    res.send(output);
  },

  async update(req, res) {
    const uuid = req.param('uuid');

    const appeal = await AppealsSchema.updateOne(
      {
        uuid,
      },
      req.body,
      {
        runValidators: true,
      }
    );

    if (appeal.n === 0) {
      req.log.debug('No appeal found');

      res.status(404).send();
      return;
    }

    res.send(
      await AppealsSchema.findOne({
        uuid,
      })
    );
  },
};
