const {
  saveAndReturnCreateService,
  saveAndReturnNotify,
  saveAndReturnGetService,
} = require('../services/save-and-return.service');
const { updateAppeal } = require('../services/appeal.service');

module.exports = {
  async saveAndReturnCreate(req, res) {
    const appeal = req.body;
    if (!req.body || !req.body.appealId) {
      res.status(400).send('Invalid Id');
      throw new Error('');
    }

    const updatedAppeal = updateAppeal(appeal);

    await saveAndReturnCreateService(updatedAppeal);
    await saveAndReturnNotify(req.body);
    res.status(201).send('ok');
  },

  async saveAndReturnGet(req, res) {
    const token = req.query;
    const appeal = await saveAndReturnGetService(token);
    res.status(200).send(appeal);
  },
};
