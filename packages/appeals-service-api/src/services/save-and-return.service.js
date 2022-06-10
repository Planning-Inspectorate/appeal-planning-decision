const logger = require('../lib/logger');
const mongodb = require('../db/db');

module.exports = {
  async saveAndReturnCreateService(saved) {
    logger.debug('XXXXXXXXXXXXXXXXXXXXXXX');
    logger.debug(saved);
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
      logger.error(saved, `Problem creating a reply`);
    }
  },

  async saveAndReturnNotify(param) {
    console.log(param);
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
