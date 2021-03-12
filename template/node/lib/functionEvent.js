const { promises: fs } = require('fs');
const uuid = require('uuid');

module.exports = class FunctionEvent {
  constructor(req, logger) {
    this.body = req.body;
    this.headers = req.headers;
    this.method = req.method;
    this.query = req.query;
    this.path = req.path;

    this.log = logger.child({ requestId: uuid.v4() });
  }

  /**
   * Get Secret
   *
   * Helper function to get secret value
   *
   * @param {string} secretName
   * @returns {Promise<string>}
   */
  // eslint-disable-next-line class-methods-use-this
  async getSecret(secretName) {
    try {
      return await fs.readFile(`/var/openfaas/secrets/${secretName}`, 'utf8');
    } catch (err) {
      return fs.readFile(`/run/secrets/${secretName}`, 'utf8');
    }
  }
};
