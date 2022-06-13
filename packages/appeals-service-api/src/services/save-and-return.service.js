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
          token: null,
          tokenStatus: 'NOT_SENT',
          appealId: saved.id,
          createdAt: new Date(),
        })
        .then(() => {
          mongodb
            .get()
            .collection('saveAndReturn')
            .findOne({ appealId: saved.appealId })
            .then((doc) => {
              logger.debug(doc, 'Saved appeal created');
              return doc;
            });
        });
    } catch (err) {
      logger.error(saved, `Error when creating in the db`);
    }
  },

  async saveAndReturnGetService(appealId) {
    let saved;
    await mongodb
      .get()
      .collection('saveAndReturn')
      .findOne({ appealId })
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

    await notifyClient
      .sendEmail(
        'b3651e9d-5cc3-4258-82b4-04ec2ba3d10e',
        'gui.ribeiro@planninginspectorate.gov.uk',
        options
      )
      .then((res) => {
        console.log(res);
        return true;
      })
      .catch((err) => {
        console.log(err);
        throw new Error(err);
      });
  },

  async saveAndReturnTokenService(email) {
    const token = this.createToken();
    try {
      await mongodb
        .get()
        .collection('saveAndReturn')
        .findAndModify({
          token,
          email,
        })
        .then(() => {
          mongodb
            .get()
            .collection('saveAndReturn')
            .findOne({ token, tokenStatus: 'SENT' })
            .then((doc) => {
              logger.debug(doc, 'Saved appeal token sent');
              return doc;
            });
        });
    } catch (err) {
      logger.error(err, `Error when creating in the db`);
    }
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
