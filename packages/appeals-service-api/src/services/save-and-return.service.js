const logger = require('../lib/logger');
const mongodb = require('../db/db');
const {
  sendSaveAndReturnContinueWithAppealEmail,
  sendSaveAndReturnEnterCodeIntoServiceEmail,
  createToken,
} = require('../lib/notify');

const saveAndReturnCreateService = async (appeal) => {
  const token = createToken();
  const query = { appealId: appeal.id };
  const option = { upsert: true };
  try {
    await mongodb
      .get()
      .collection('saveAndReturn')
      .updateOne(
        query,
        {
          $set: {
            token,
            tokenStatus: 'NOT_SENT',
            appealId: appeal.id,
            createdAt: new Date(),
          },
        },
        option
      );
  } catch (err) {
    logger.error(err, `Error when creating in the db`);
  }
  return token;
};

const saveAndReturnGetService = async (appealId) => {
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
};

const saveAndReturnGetServiceToken = async (tokenA) => {
  let saved;
  await mongodb
    .get()
    .collection('saveAndReturn')
    .findOne({ token: tokenA })
    .then((doc) => {
      saved = doc;
    })
    .catch((err) => {
      console.log(err);
      throw new Error(err);
    });
  return saved;
};

const saveAndReturnNotifyContinue = async (saved, token) => {
  await sendSaveAndReturnContinueWithAppealEmail(saved, token);
};

const saveAndReturnNotifyCode = async (saved, token) => {
  await sendSaveAndReturnEnterCodeIntoServiceEmail(saved, token);
};

const saveAndReturnTokenService = async (email) => {
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
};

module.exports = {
  saveAndReturnCreateService,
  saveAndReturnGetService,
  saveAndReturnTokenService,
  saveAndReturnNotifyContinue,
  saveAndReturnNotifyCode,
  saveAndReturnGetServiceToken,
};
