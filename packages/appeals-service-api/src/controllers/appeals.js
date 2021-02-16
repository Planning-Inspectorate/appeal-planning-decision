const uuid = require('uuid');
const { _ } = require('lodash');
const logger = require('../lib/logger');

const mongodb = require('../db/db');
const { validateAppeal } = require('../services/validation.service');
const { appealDocument } = require('../models/appeal');

const queue = require('../lib/queue');

module.exports = {
  async createAppeal(req, res) {
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
        .insertOne({ _id: appeal.id, uuid: appeal.id, appeal });

      logger.debug(`Appeal ${appeal.id} created`);
      res.status(201).send(appeal);
    } catch (err) {
      logger.error(`Problem creating an appeal ${appeal.id}\n${err}`);
      res.status(500).send(`Problem creating an appeal`);
    }
  },

  async getAppeal(req, res) {
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

  async updateAppeal(req, res) {
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
          if (originalDoc.appeal.state === 'SUBMITTED') {
            logger.debug('Appeal is already submitted so end processing request with 409 response');
            res
              .status(409)
              .send({ code: 409, errors: ['Cannot update appeal that is already SUBMITTED'] });
          } else {
            logger.debug('Appeal is not already submitted so continue processing request');

            const validatedAppealDto = _.merge(originalDoc.appeal, req.body);
            validatedAppealDto.updatedAt = new Date(new Date().toISOString());

            const errors = validateAppeal(validatedAppealDto);

            if (idParam !== validatedAppealDto.id) {
              errors.push(
                'The provided id in path must be the same as the appeal id in the request body'
              );
            }

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
                  if (validatedAppealDto.state === 'SUBMITTED') {
                    queue.addAppeal(validatedAppealDto);
                  }
                });
            }
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

  async replaceAppeal(req, res) {
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
          if (originalDoc.appeal.state === 'SUBMITTED') {
            logger.debug('Appeal is already submitted so end processing request with 409 response');
            res
              .status(409)
              .send({ code: 409, errors: ['Cannot update appeal that is already SUBMITTED'] });
          } else {
            logger.debug('Appeal is not already submitted so continue processing request');

            logger.debug(`Original doc \n${originalDoc.appeal}`);
            const validatedAppealDto = req.body;

            if (
              validatedAppealDto.decisionDate !== null &&
              validatedAppealDto.decisionDate !== undefined
            ) {
              validatedAppealDto.decisionDate = new Date(validatedAppealDto.decisionDate);
            }

            validatedAppealDto.createdAt = new Date(originalDoc.appeal.createdAt);
            validatedAppealDto.updatedAt = new Date(new Date().toISOString());

            const errors = validateAppeal(validatedAppealDto);

            if (idParam !== validatedAppealDto.id) {
              errors.push(
                'The provided id in path must be the same as the appeal id in the request body'
              );
            }

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
                  { $set: { uuid: idParam, appeal: validatedAppealDto } }
                )
                .then(() => {
                  logger.debug(`Updated appeal ${idParam}\n`);
                  statusCode = 200;
                  body = validatedAppealDto;
                  if (validatedAppealDto.state === 'SUBMITTED') {
                    queue.addAppeal(validatedAppealDto);
                  }
                })
                .catch((err) => {
                  logger.error(`Problem updating appeal ${idParam}\n${err}`);
                  statusCode = 500;
                  body = `Problem updating appeal`;
                });
            }
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
