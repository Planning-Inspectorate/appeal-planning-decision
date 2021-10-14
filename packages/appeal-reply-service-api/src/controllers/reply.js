const uuid = require('uuid');
const logger = require('../lib/logger');
const mongodb = require('../db/db');
const ReplyModel = require('../models/replySchema');
const notify = require('../lib/notify');
const queue = require('../lib/queue');
const sqlQueue = require('../lib/sql-lpa-queue');

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
    logger.debug({ replyId: reply.id }, 'Creating reply...');
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
              logger.debug({ replyId: reply.id }, 'Reply created');
              res.status(201).send(doc.reply);
            });
        });
    } catch (err) {
      logger.error({ replyId: reply.id, err }, `Problem creating a reply`);
      res.status(500).send(`Problem creating a reply`);
    }
  },

  async get(req, res) {
    const idParam = req.params.id;
    logger.debug({ idParam }, `Retrieving reply from MongoDb`);
    try {
      await mongodb
        .get()
        .collection(dbId)
        .findOne({ _id: idParam })
        .then((doc) => {
          logger.debug({ idParam }, `Reply retrieved`);
          res.status(200).send(doc.reply);
        })
        .catch((err) => {
          logger.warn({ idParam, err }, `Could not find reply`);
          res.status(404).send(null);
        });
    } catch (err) {
      logger.error({ idParam, err }, `Problem retrieving reply`);
      res.status(500).send({ idParam }, `Problem finding reply`);
    }
  },

  async getByAppeal(req, res) {
    const appealId = req.params.id;
    logger.debug(`Retrieving reply by appeal ID ${appealId} ...`);
    try {
      await mongodb
        .get()
        .collection(dbId)
        .findOne({ 'reply.appealId': { $eq: appealId } })
        .then((doc) => {
          logger.debug(`Reply for appeal ${appealId} retrieved`);
          res.status(200).send(doc.reply);
        })
        .catch((err) => {
          logger.warn(`Could not find reply for appeal ${appealId}\n${err}`);
          res.status(404).send(null);
        });
    } catch (err) {
      logger.error({ appealId, err }, 'Problem retrieving reply for appeal');
      res.status(500).send(`Problem finding reply for appeal ${appealId}`);
    }
  },

  async update(req, res) {
    const idParam = req.params.id;
    logger.debug({ idParam }, `Updating reply ...`);

    const newDoc = req.body;

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
          .then(async () => {
            logger.debug({ idParam }, `Updated reply`);

            const isFirstSubmission =
              originalDoc.state !== 'SUBMITTED' && newDoc.state === 'SUBMITTED';
            if (isFirstSubmission) {
              logger.info({ newDoc }, 'STEVE_IS_FIRST_SUBMISSION');
              newDoc.submissionDate = new Date().toISOString();
            }

            if (isFirstSubmission) {
              logger.info({ newDoc }, 'First submission for questionnaire');
              await sqlQueue.addAppealReply(newDoc);
              await queue.addAppealReply(newDoc);
              try {
                await notify.sendAppealReplySubmissionConfirmationEmailToLpa(req.body);
                res.status(200).send(req.body);
              } catch (err) {
                logger.error({ err, idParam }, 'Problem sending email');
                res.status(500).send(`Problem sending email`);
              }
            } else {
              res.status(200).send(req.body);
            }
          })
          .catch((err) => {
            logger.error({ idParam, err }, `Problem updating reply`);
            res.status(500).send(`Problem updating reply`);
          });
      })
      .catch((err) => {
        logger.warn({ idParam, err }, `Couldn't find reply to update`);
        res.status(404).send(`Couldn't find reply`);
      });
  },
};
