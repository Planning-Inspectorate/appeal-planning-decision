const uuid = require('uuid');
const logger = require('../lib/logger');

const mongodb = require('../db/db');
const { appealDocument } = require('../models/appeal');
const { validateAppeal } = require('../middleware/validateAppeal');

module.exports = {
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

  async create(req, res) {
    const appeal = JSON.parse(JSON.stringify(appealDocument));
    appeal.id = uuid.v4();
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

  async insert(req, res) {
    let statusCode;
    let body;
    const appeal = req.body;

    const errors = validateAppeal(appeal);

    if (appeal.id || errors.length > 0) {
      logger.debug(`Validated payload for appeal update generated errors:\n ${appeal}\n${errors}`);

      if (appeal.id) {
        errors.push(`The expected id field should be empty but instead received ${appeal.id}`);
      }

      res.status(400).send({ code: 400, errors });
    } else {
      appeal.id = uuid.v4();

      logger.debug(`Inserting appeal ${appeal.id} ...`);
      try {
        await mongodb
          .get()
          .collection('appeals')
          // eslint-disable-next-line func-names
          .insertOne({ _id: appeal.id, uuid: appeal.id, appeal }, function (error, response) {
            if (error) {
              statusCode = 500;
              body = `Problem inserting an appeal ${error}`;
            } else {
              statusCode = 202;
              body = response.ops[0].appeal;
              if (body.decisionDate !== null) {
                body.decisionDate = body.decisionDate.toISOString().substring(0, 10);
              }
            }
            res.status(statusCode).send(body);
          });
      } catch (err) {
        logger.error(`Problem inserting the appeal\n${err}`);
        statusCode = 500;
        body = `Problem inserting an appeal`;
        res.status(statusCode).send(body);
      }
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
          logger.debug(`Original doc \n${originalDoc.appeal}`);
          const validatedAppealDto = req.body;
          if (validatedAppealDto.decisionDate !== null) {
            validatedAppealDto.decisionDate = validatedAppealDto.decisionDate
              .toISOString()
              .substring(0, 10);
          }
          const errors = validateAppeal(validatedAppealDto);
          if (validatedAppealDto.id !== idParam || errors.length > 0) {
            logger.debug(
              `Validated payload for appeal update generated errors:\n ${validatedAppealDto}\n${errors}`
            );

            if (validatedAppealDto.id !== idParam) {
              errors.push(
                'The provided id in path must be the same as the appeal id in the request body'
              );
            }

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
