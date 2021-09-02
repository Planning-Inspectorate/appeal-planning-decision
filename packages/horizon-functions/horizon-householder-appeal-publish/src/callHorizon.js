const axios = require('axios');
const config = require('./config');

/**
 * Call Horizon
 *
 * Calls Horizon and gets the ID of the created
 * case
 *
 * @param log
 * @param input
 * @returns {Promise<string>}
 */
const callHorizon = async (log, input) => {
  log.info(input, 'Calling Horizon');

  const { data } = await axios.post('/horizon', input, {
    baseURL: config.horizon.url,
  });

  log.info({ data }, 'Horizon response');

  // case IDs are in format APP/W4705/D/21/3218521 - we need last 7 digits or numbers after final slash (always the same)
  const horizonFullCaseId = data?.Envelope?.Body?.CreateCaseResponse?.CreateCaseResult?.value;

  if (!horizonFullCaseId) {
    log.error(
      { input: data?.Envelope?.Body?.CreateCaseResponse?.CreateCaseResult },
      'Horizon ID malformed'
    );
    throw new Error('Horizon ID malformed');
  }

  const parsedHorizonId = horizonFullCaseId.split('/').slice(-1).pop();

  log.debug({ parsedHorizonId, horizonFullCaseId }, 'Horizon ID parsed');

  return parsedHorizonId;
};

module.exports = { callHorizon };
