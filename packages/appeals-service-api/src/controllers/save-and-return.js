const {
  saveAndReturnCreateService,
  saveAndReturnNotify,
  saveAndReturnGetService,
  saveAndReturnTokenService,
} = require('../services/save-and-return.service');
const { replaceAppeal } = require('../services/appeal.service');

module.exports = {
  async saveAndReturnCreate(req, res) {
    console.log(req.body)
    const appeal = req.body;
    if (!appeal || !appeal.id) {
      res.status(400).send('Invalid Id');
      throw new Error('');
    }

    await replaceAppeal(appeal);

    await saveAndReturnCreateService(appeal);
    // await saveAndReturnNotify(req.body)
    res.status(201).send(appeal);
  },

  async saveAndReturnGet(req, res) {
    const { appealId } = req.params;
    const appeal = await saveAndReturnGetService(appealId);
    res.status(200).send(appeal);
  },

  async saveAndReturnToken(req, res) {
    const appeal = req.body;
    if (!req.body || !req.body.appealId) {
      res.status(400).send('Invalid Id');
      throw new Error('');
    }
    const saved = saveAndReturnTokenService(appeal.appealId);
    res.status(200).send(saved);
  },
};
