const logger = require('../lib/logger');
const mongodb = require('../db/db');
const {
  sendSaveAndReturnContinueWithAppealEmail,
  sendSaveAndReturnEnterCodeIntoServiceEmail,
} = require('../lib/notify');

const createToken = () => {
  const token = [];
  for (let i = 0; i < 5; i += 1) {
    const num = Math.floor(Math.random() * 9 + 1);
    token.push(num);
  }
  return +token.join('');
};

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
  createToken,
};
