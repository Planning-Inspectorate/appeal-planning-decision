const logger = require('../lib/logger');
const mongodb = require('../db/db');
const {
  sendSaveAndReturnContinueWithAppealEmail,
  sendSaveAndReturnEnterCodeIntoServiceEmail,
} = require('../lib/notify');

module.exports = {
  async saveAndReturnCreateService(appeal) {
    const query = { appealId: appeal.id };
    const option = { upsert: true };
    let savedAppeal;
    try {
      await mongodb
        .get()
        .collection('saveAndReturn')
        .updateOne(
          query,
          {
            $set: {
              token: null,
              tokenStatus: 'NOT_SENT',
              appealId: appeal.id,
              createdAt: new Date(),
            },
          },
          option
        )
        .then(async () => {
          await mongodb
            .get()
            .collection('saveAndReturn')
            .findOne({ appealId: appeal.appealId })
            .then((doc) => {
              logger.debug(doc, 'Saved appeal created');
              savedAppeal = doc.value;
            });
        });
    } catch (err) {
      logger.error(err, `Error when creating in the db`);
    }
    return savedAppeal;
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

  async saveAndReturnNotifyContinue(saved) {
    await sendSaveAndReturnContinueWithAppealEmail(saved);
  },

  async saveAndReturnNotifyCode(saved, token) {
    await sendSaveAndReturnEnterCodeIntoServiceEmail(saved, token);
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
