const { migrateMetadata } = require('../lib/migrateMetadata');

const migrate = async (req, res) => {
  try {
    const documents = await migrateMetadata();
    res.send(documents);
  } catch (err) {
    req.log.error({ err }, 'Failed to migrate metadata');
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  migrate,
};
