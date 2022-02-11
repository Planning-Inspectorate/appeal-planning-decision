const uuid = require('uuid');
const { _ } = require('lodash');
const logger = require('../lib/logger');
const {
  getAppeal: getAppealFromAppealApiService,
  updateAppeal,
  insertAppeal,
} = require('../services/appeal.service');
const ApiError = require('../error/apiError');
const { appealDocument } = require('../models/appeal');
const { featureFlag } = require('../lib/config');

module.exports = {
  async createAppeal(req, res) {
    let appeal = {};

    if (!featureFlag.newAppealJourney) {
      appeal = JSON.parse(JSON.stringify(appealDocument));
    }

    const now = new Date(new Date().toISOString());
    appeal.id = uuid.v4();
    appeal.createdAt = now;
    appeal.updatedAt = now;

    logger.debug(`Creating appeal ${appeal.id} ...`);

    const document = await insertAppeal(appeal);

    if (document.result && document.result.ok) {
      logger.debug(`Appeal ${appeal.id} created`);
      res.status(201).send(appeal);
      return;
    }

    logger.error(`Problem while ${appeal.id} created`);
    res.status(500).send(appeal);
  },

  async getAppeal(req, res) {
    const idParam = req.params.id;

    logger.debug(`Retrieving appeal ${idParam} ...`);
    try {
      const document = await getAppealFromAppealApiService(idParam);

      if (document === null) {
        throw ApiError.appealNotFound(idParam);
      }

      logger.debug(`Appeal ${idParam} retrieved`);
      res.status(200).send(document.appeal);
    } catch (e) {
      if (e instanceof ApiError) {
        logger.debug(e.message);
        res.status(e.code).send({ code: e.code, errors: e.message.errors });
        return;
      }
      logger.error(e.message);
      res.status(500).send(`Problem getting the appeal ${idParam}\n${e}`);
    }
  },

  async updateAppeal(req, res) {
    const idParam = req.params.id;
    logger.debug(`Updating appeal ${idParam} ...`);

    try {
      const document = await getAppealFromAppealApiService(idParam);

      if (document === null) {
        throw ApiError.appealNotFound(idParam);
      }

      const newAppeal = req.body;
      const oldAppeal = document.appeal;

      const isFirstSubmission = oldAppeal.state === 'DRAFT' && newAppeal.state === 'SUBMITTED';

      const updatedDocument = await updateAppeal(_.merge(oldAppeal, newAppeal), isFirstSubmission);

      res.status(200).send(updatedDocument.appeal);
    } catch (e) {
      logger.error(e.message);

      if (e instanceof ApiError) {
        res.status(e.code).send({ code: e.code, errors: e.message.errors });
        return;
      }

      res.status(500).send(`Problem updating appeal ${idParam}\n${e}`);
    }
  },
};
