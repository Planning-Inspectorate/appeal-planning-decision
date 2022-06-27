const logger = require('../lib/logger');
const mongodb = require('../db/db');
const { sendConfirmEmailAddressEmail, createToken } = require('../lib/notify');

const confirmEmailCreateService = async (appeal) => {
  const token = createToken();
  const query = { appealId: appeal.id };
  const option = { upsert: true };
  try {
    await mongodb
      .get()
      .collection('confirmEmail')
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

const confirmEmailNotifyContinue = async (saved, token) => {
  await sendConfirmEmailAddressEmail(saved, token);
};

module.exports = {
  confirmEmailCreateService,
  confirmEmailNotifyContinue,
};
