const uuid = require('uuid');
const { _ } = require('lodash');
const logger = require('../lib/logger');

const mongodb = require('../db/db');
const { appealDocument } = require('../models/appeal');
const { validateAppeal } = require('../middleware/validateAppeal');

module.exports = {
  async create(req, res) {
    const appeal = JSON.parse(JSON.stringify(appealDocument));
    appeal.id = uuid.v4();

    const now = new Date(new Date().toISOString());
    appeal.createdAt = now;
    appeal.updatedAt = now;

    logger.debug(`Creating appeal ${appeal.id} ...`);
    try {
      await mongodb
        .get()
        .collection('appeals')
        .insertOne({ _id: appeal.id, uuid: appeal.id, appeal })
        .then(() => {
          mongodb
            .get()
            .collection('appeals')
            .findOne({ _id: appeal.id })
            .then((doc) => {
              logger.debug(`Appeal ${appeal.id} created`);
              res.status(201).send(doc.appeal);
            });
        });
    } catch (err) {
      logger.error(`Problem creating an appeal ${appeal.id}\n${err}`);
      res.status(500).send(`Problem creating an appeal`);
    }
  },

  async get(req, res) {
    const idParam = req.params.id;
    logger.debug(`Retrieving appeal ${idParam} ...`);
    try {
      await mongodb
        .get()
        .collection('appeals')
        .findOne({ _id: idParam })
        .then((doc) => {
          logger.debug(`Appeal ${idParam} retrieved`);
          res.status(200).send(doc.appeal);
        })
        .catch((err) => {
          logger.warn(`Could not find appeal ${idParam}\n${err}`);
          res.status(404).send(null);
        });
    } catch (err) {
      logger.error(`Problem retrieving appeal ${idParam}\n${err}`);
      res.status(500).send(`Problem finding appeal ${idParam}`);
    }
  },

  async update(req, res) {
    let statusCode;
    let body;
    const idParam = req.params.id;
    logger.debug(`Updating appeal ${idParam} ...`);

    try {
      await mongodb
        .get()
        .collection('appeals')
        .findOne({ _id: idParam })
        .then(async (originalDoc) => {
          const validatedAppealDto = _.merge(originalDoc.appeal, req.body);
          validatedAppealDto.updatedAt = new Date(new Date().toISOString());

          const errors = validateAppeal(idParam, validatedAppealDto);
          if (errors.length > 0) {
            logger.debug(
              `Validated payload for appeal update generated errors:\n ${validatedAppealDto}\n${errors}`
            );
            statusCode = 400;
            body = { code: 400, errors };
          } else {
            await mongodb
              .get()
              .collection('appeals')
              .updateOne(
                { _id: idParam },
                { $set: { uuid: idParam, appeal: validatedAppealDto } },
                { upsert: false }
              )
              .then(async () => {
                logger.debug(`Updated appeal ${idParam}\n`);
                statusCode = 200;
                body = validatedAppealDto;
              });
          }
        })
        .catch((err) => {
          logger.warn(`Could find appeal ${idParam} to update\n${err}`);
          statusCode = 404;
          body = null;
        });

      res.status(statusCode).send(body);
    } catch (err) {
      logger.error(`Problem updating appeal ${idParam}\n${err}`);
      res.status(500).send(`Problem updating appeal`);
    }
  },

  async replace(req, res) {
    let statusCode;
    let body;
    const idParam = req.params.id;
    logger.debug(`Updating appeal ${idParam} ...`);
    try {
      await mongodb
        .get()
        .collection('appeals')
        .findOne({ _id: idParam })
        .then(async (originalDoc) => {
          logger.debug(`Original doc \n${originalDoc.appeal}`);
          const validatedAppealDto = req.body;
          validatedAppealDto.decisionDate = new Date(validatedAppealDto.decisionDate);
          validatedAppealDto.createdAt = new Date(validatedAppealDto.createdAt);
          validatedAppealDto.updatedAt = new Date(new Date().toISOString());

          const errors = validateAppeal(idParam, validatedAppealDto);
          if (errors.length > 0) {
            logger.debug(
              `Validated payload for appeal update generated errors:\n ${validatedAppealDto}\n${errors}`
            );
            statusCode = 400;
            body = { code: 400, errors };
          } else {
            await mongodb
              .get()
              .collection('appeals')
              .updateOne({ _id: idParam }, { $set: { uuid: idParam, appeal: validatedAppealDto } })
              .then(() => {
                logger.debug(`Updated appeal ${idParam}\n`);
                statusCode = 200;
                body = validatedAppealDto;
              })
              .catch((err) => {
                logger.error(`Problem updating appeal ${idParam}\n${err}`);
                statusCode = 500;
                body = `Problem updating appeal`;
              });
          }
        })
        .catch((err) => {
          logger.warn(`Could find appeal ${idParam} to update\n${err}`);
          statusCode = 404;
          body = null;
        });
      res.status(statusCode).send(body);
    } catch (err) {
      logger.error(`Problem updating appeal ${idParam}\n${err}`);
      res.status(500).send(`Problem updating appeal`);
    }
  },
};
