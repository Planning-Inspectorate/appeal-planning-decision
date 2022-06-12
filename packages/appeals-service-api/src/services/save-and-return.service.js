const { NotifyClient } = require('notifications-node-client').NotifyClient;
const config = require('@pins/common/src/config');
const logger = require('../lib/logger');
const mongodb = require('../db/db');

module.exports = {
  async saveAndReturnCreateService(saved) {
    try {
      await mongodb
        .get()
        .collection('saveAndReturn')
        .insertOne({
          token: saved.token,
          appealId: saved.appealId,
          lastPage: saved.lastPage,
        })
        .then(() => {
          mongodb
            .get()
            .collection('saveAndReturn')
            .findOne({ token: saved.token })
            .then((doc) => {
              logger.debug(doc, 'Reply created');
              return doc;
            });
        });
    } catch (err) {
      logger.error(saved, `Error when creating in the db`);
    }
  },

  async saveAndReturnGetService(email) {
    let saved;
    await mongodb
      .get()
      .collection('saveAndReturn')
      .findOne({ email })
      .then((doc) => {
        saved = doc.value;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
    return saved;
  },

  async saveAndReturnNotify(saved) {
    // TODO - using the existing builder vs using tthe API directly
    const notifyClient = new NotifyClient(config.services.notify.apiKey);
    const options = {
      personalisation: '',
      reference: '',
      emailReplyToId: '',
    };
    await notifyClient.sendEmail(this.templateId, this.destinationEmail, options);
    return true;
  },

  createToken() {
    const token = [];
    for (let i = 0; i < 5; i += 1) {
      const num = Math.floor(Math.random() * 9 + 1);
      token.push(num);
    }
    return +token.join('');
  },
};
