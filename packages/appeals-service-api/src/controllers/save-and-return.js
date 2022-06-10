const logger = require('../lib/logger');
const {
  createToken,
  saveAndReturnCreateService,
  saveAndReturnNotify,
} = require('../services/save-and-return.service');

module.exports = {
  async saveAndReturnCreate(req, res) {
    const { appealId, lastPage } = req.body;
    if (!req.body || !req.body.appealId) {
      res.status(400).send('Invalid Id');
      return;
    }
    const token = await createToken();

    await saveAndReturnCreateService({ appealId, lastPage, token });
    await saveAndReturnNotify(token);
    res.status(201).send('ok');
  },
};
