const sql = require('mssql');
const config = require('./src/config');
const { catchErrorHandling } = require('./src/catchErrorHandling');

module.exports = async (context, event) => {
  context.log('Start SQL');
  try {
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

    req.input('AppealId', event.appealId);
    req.input('Data', JSON.stringify(event));

    await req.query('insert into messagequeue(appealid,QueueType,data) values(@AppealId,2,@Data);');

    return {
      id: 0,
    };
  } catch (err) {
    const [message, httpStatus] = catchErrorHandling(context.log, err);
    context.httpStatus = httpStatus;

    return {
      message,
    };
  }
};
