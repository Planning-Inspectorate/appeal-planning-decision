const { pipe, gotenberg, convert, html, please, set, scale, to } = require('gotenberg-js-client');
const config = require('./config');

const toPDF = pipe(
  gotenberg(`${config.gotenberg.url}`),
  convert,
  html,
  set(scale(1.0)),
  to({
    marginTop: 0.2,
    marginBottom: 0.2,
    marginLeft: 0.2,
    marginRight: 0.2,
  }),
  please
);

module.exports = toPDF;
