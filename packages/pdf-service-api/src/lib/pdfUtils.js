const { pipe, gotenberg, convert, html, please, set, scale, to } = require('gotenberg-js-client');
const config = require('./config');

module.exports = {
  async toPDF() {
    return pipe(
      gotenberg(`${config.gotenberg.url}`),
      convert,
      html,
      set(scale(0.75)),
      to({
        marginTop: 0.2,
        marginBottom: 0.2,
        marginLeft: 0.2,
        marginRight: 0.2,
      }),
      please
    );
  },
};
