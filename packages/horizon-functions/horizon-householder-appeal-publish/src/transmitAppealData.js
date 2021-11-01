const axios = require('axios');
const sql = require('mssql');
const config = require('./config');

/**
 * Get LPA Data
 *
 * Returns the LPA data
 *
 * @param log
 * @param code
 * @returns {Promise<{ id: string, name: string, inTrial: boolean, england: boolean, wales: boolean, horizonId: string }>}
 */

const transmitAppealData = async (log, code) => {
  log({ code }, 'Getting Appeal data from Appeals Service API');

  const { data } = await axios.get(`/api/v1/appeals/${code}`, {
    baseURL: config.appealsService.url,
  });

  const sqlConfig = {
    user: config.sqlServer.username,
    password: config.sqlServer.password,
    database: config.sqlServer.database,
    server: config.sqlServer.server,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: true, // for azure
      trustServerCertificate: false, // change to true for local dev / self-signed certs
    },
  };

  const pool = await sql.connect(sqlConfig);
  const req = new sql.Request(pool);

  req.input('AppealId', code);
  req.input('Data', JSON.stringify(data));

  await req.query('insert into messagequeue(appealid,QueueType,data) values(@AppealId,1,@Data);');

  return data;
};

module.exports = { transmitAppealData };
