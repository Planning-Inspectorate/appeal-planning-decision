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
    const appeal = {};

    const now = new Date(new Date().toISOString());
    appeal.id = uuid.v4();
    appeal.createdAt = now;
    appeal.updatedAt = now;

    logger.debug(`Creating appeal ${appeal.id} ...`);
    logger.debug({ appeal }, 'Appeal data in createAppeal');

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
    logger.info('IN UPDATE APPEAL METHOD :/');
    const idParam = req.params.id;
    logger.debug(`Updating appeal ${idParam} ...`);

    try {
      const document = await getAppealFromAppealApiService(idParam);

      if (document === null) {
        throw ApiError.appealNotFound(idParam);
      }

      let newAppeal = req.body;
      const oldAppeal = document.appeal;

      logger.debug({ newAppeal }, 'New appeal data in updateAppeal');

      const isFirstSubmission = oldAppeal.state === 'DRAFT' && newAppeal.state === 'SUBMITTED';

      const updatedDocument = await updateAppeal(newAppeal, isFirstSubmission);

      logger.debug({ updatedDocument }, 'Updated appeal data in updateAppeal');

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

  async patchAppeal(req, res) {
    const idParam = req.params.id;
    logger.debug(`Patching appeal ${idParam} ...`);

    try {
      const document = await getAppealFromAppealApiService(idParam);

      if (document === null) {
        throw ApiError.appealNotFound(idParam);
      }

      let newAppeal = req.body;
      const oldAppeal = document.appeal;

      logger.debug({ newAppeal }, 'New appeal data in updateAppeal');

      newAppeal = _.merge(oldAppeal, newAppeal);

      const updatedDocument = await updateAppeal(newAppeal, false);

      logger.debug({ updatedDocument }, 'Updated appeal data in updateAppeal');

      res.status(200).send(updatedDocument.appeal);
    } catch (e) {
      logger.error(e.message);

      if (e instanceof ApiError) {
        res.status(e.code).send({ code: e.code, errors: e.message.errors });
        return;
      }

      res.status(500).send(`Problem patching appeal ${idParam}\n${e}`);
    }
  },
};
