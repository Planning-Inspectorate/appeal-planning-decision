const express = require('express');
const bodyParser = require('body-parser');

const FunctionEvent = require('./lib/functionEvent');
const FunctionContext = require('./lib/functionContext');
const handler = require('./function/handler');

const app = express();
app.disable('x-powered-by');

if (process.env.RAW_BODY === 'true') {
  app.use(bodyParser.raw({ type: '*/*' }));
} else {
  const jsonLimit = process.env.MAX_JSON_SIZE || '100kb'; // body-parser default
  app.use(bodyParser.json({ limit: jsonLimit }));
  app.use(bodyParser.raw()); // "Content-Type: application/octet-stream"
  app.use(bodyParser.text({ type: 'text/*' }));
}

const isArray = (input) => !!input && input.constructor === Array;

const isObject = (input) => !!input && input.constructor === Object;

const middleware = async (req, res) => {
  const fnEvent = new FunctionEvent(req);
  const fnContext = new FunctionContext();

  let output;
  try {
    output = await handler(fnEvent, fnContext);
  } catch (err) {
    console.error(err);
    output = err.toString ? err.toString() : err;
    fnContext.httpStatus = 500;
  }

  const fnResult = isArray(output) || isObject(output) ? JSON.stringify(output) : output;

  res.status(fnContext.httpStatus).set(fnContext.httpHeaders).send(fnResult);
};

app.post('/*', middleware);
app.get('/*', middleware);
app.patch('/*', middleware);
app.put('/*', middleware);
app.delete('/*', middleware);

const port = Number(process.env.http_port || 3000);

app.listen(port, () => {
  console.log(`OpenFaaS Node.js listening on port: ${port}`);
});
