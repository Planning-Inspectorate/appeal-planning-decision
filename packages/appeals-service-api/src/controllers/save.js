const {
  saveAndReturnCreateService,
  saveAndReturnNotifyContinue,
  saveAndReturnGetService,
  saveAndReturnTokenService,
  saveAndReturnNotifyCode,
} = require('../services/save-and-return.service');

async function saveAndReturnCreate(req, res) {
  const appeal = req.body;
  if (!appeal || !appeal.id) {
    res.status(400).send('Invalid Id');
    throw new Error('');
  }
  const token = await saveAndReturnCreateService(appeal);
  await saveAndReturnNotifyContinue(appeal, token);
  res.status(201).send(appeal);
}

async function saveAndReturnGet(req, res) {
  const { appealId } = req.params;
  const appeal = await saveAndReturnGetService(appealId);
  res.status(200).send(appeal);
}

async function saveAndReturnToken(req, res) {
  const appeal = req.body;
  if (!req.body || !req.body.appealId) {
    res.status(400).send('Invalid Id');
    throw new Error('');
  }
  const saved = saveAndReturnTokenService(appeal.appealId);
  await saveAndReturnNotifyCode(req.body, saved.token);
  res.status(200).send(saved);
}

module.exports = {
  saveAndReturnCreate,
  saveAndReturnGet,
  saveAndReturnToken,
};
