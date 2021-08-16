const { getLPA } = require('../lib/appeals-api-wrapper');

module.exports = async (req, res, next) => {
  const { lpaCode } = req.params;

  if (!lpaCode) {
    res.status(404).send();
    return;
  }

  try {
    req.log.debug({ lpaCode }, 'Get LPA data.');
    req.lpa = await getLPA(lpaCode);
  } catch (err) {
    req.log.debug({ err }, 'Error retrieving LPA.');

    res.status(404).send();
    return;
  }

  next();
};
