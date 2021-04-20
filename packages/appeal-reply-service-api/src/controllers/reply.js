const uuid = require('uuid');
const logger = require('../lib/logger');
const mongodb = require('../db/db');
const ReplyModel = require('../models/replySchema');

const dbId = 'reply';

const findByAppealId = (appealId) => ({ 'reply.appealId': { $eq: appealId } });

module.exports = {
  async create(req, res) {
    const { appealId } = req.body;
    if (appealId === '' || appealId === undefined) {
      logger.error(`Problem creating reply - no appealID`);
      res.status(400).send(`AppealId must be included`);
      return;
    }
    const reply = new ReplyModel({
      id: uuid.v4(),
      appealId,
    });

    logger.info(`Creating reply ${reply.id} for appeal:: ${appealId}`);
    try {
      await mongodb
        .get()
        .collection(dbId)
        .insertOne({ _id: reply.id, uuid: reply.id, reply })
        .then(() => {
          mongodb
            .get()
            .collection(dbId)
            .findOne(findByAppealId(appealId))
            .then((doc) => {
              logger.debug(`Reply ${reply.id} created`);
              res.status(201).send(doc.reply);
            });
        });
    } catch (err) {
      logger.error(`Problem creating a reply ${reply.id}\n${err}`);
      res.status(500).send(`Problem creating an reply`);
    }
  },

  async get(req, res) {
    const idParam = req.params.id;
    logger.info(`Retrieving reply for appealId:: ${idParam}`);
    try {
      await mongodb
        .get()
        .collection(dbId)
        .findOne(findByAppealId(idParam))
        .then((doc) => {
          logger.debug(`Reply ${idParam} retrieved`);
          if (!doc) {
            logger.warn(`Could not find reply ${idParam}`);
            res.status(404).send(null);
          } else {
            res.status(200).send(doc);
          }
        })
        .catch((err) => {
          logger.error(err);
          logger.warn(`Could not find reply ${idParam}\n${err}`);
          res.status(404).send(null);
        });
    } catch (err) {
      logger.error(`Problem retrieving reply ${idParam}\n${err}`);
      res.status(500).send(`Problem finding reply ${idParam}`);
    }
  },

  async update(req, res) {
    const idParam = req.params.id;
    logger.info(`Updating reply for appealId:: ${idParam}`);

    await mongodb
      .get()
      .collection(dbId)
      .findOne(findByAppealId(idParam))
      .then((originalDoc) => {
        return mongodb
          .get()
          .collection(dbId)
          .updateOne({ _id: originalDoc._id }, { $set: { reply: req.body } }) // eslint-disable-line no-underscore-dangle
          .then(() => {
            res.status(200).send(req.body);
          })
          .catch((err) => {
            logger.error(`Problem updating reply ${idParam}\n${err}`);
            res.status(500).send(`Problem updating reply`);
          });
      })
      .catch((err) => {
        logger.warn(`Couldn't find reply ${idParam} to update\n${err}`);
        res.status(404).send(`Couldn't find reply`);
      });
  },
};
