const {
  confirmEmailCreateService,
  confirmEmailNotifyContinue,
} = require('../services/confirm-email.service');

async function confirmEmailCreate(req, res) {
  const appeal = req.body;
  if (!appeal || !appeal.id) {
    res.status(400).send('Invalid Id');
    throw new Error('');
  }
  const token = await confirmEmailCreateService(appeal);
  await confirmEmailNotifyContinue(appeal, token);
  res.status(201).send(appeal);
}

module.exports = {
  confirmEmailCreate,
};
