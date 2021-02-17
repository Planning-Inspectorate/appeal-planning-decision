const uuid = require('uuid');
const logger = require('../lib/logger');
const mongodb = require('../db/db');
// const { blankReply } = require('../models/blankReply');
const ReplyModel = require('../models/replySchema');

const dbId = 'reply';

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
    logger.debug(`Creating reply ${reply.id} ...`);
    try {
      await mongodb
        .get()
        .collection(dbId)
        .insertOne({ _id: reply.id, uuid: reply.id, reply })
        .then(() => {
          mongodb
            .get()
            .collection(dbId)
            .findOne({ _id: reply.id })
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
    logger.debug(`Retrieving reply ${idParam} ...`);
    try {
      await mongodb
        .get()
        .collection(dbId)
        .findOne({ _id: idParam })
        .then((doc) => {
          logger.debug(`Reply ${idParam} retrieved`);
          res.status(200).send(doc.reply);
        })
        .catch((err) => {
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
    logger.debug(`Updating reply ${idParam} ...`);

    await mongodb
      .get()
      .collection(dbId)
      .findOne({ _id: idParam })
      .then(async (originalDoc) => {
        logger.debug(`Original doc \n${originalDoc.reply}`);

        await mongodb
          .get()
          .collection(dbId)
          .updateOne({ _id: idParam }, { $set: { uuid: idParam, reply: req.body } })
          .then(() => {
            logger.debug(`Updated reply ${idParam}\n`);
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
