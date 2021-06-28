const { BasicStrategy } = require('passport-http');

module.exports = new BasicStrategy((appealId, sessionId, done) => {
  // if (username !== 'aaa') {
  return done(null, false);
  // }

  // return done(null, { hello: 'world' });
});
