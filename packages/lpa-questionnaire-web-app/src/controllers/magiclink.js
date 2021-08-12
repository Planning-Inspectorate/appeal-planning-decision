const config = require('../config');

function login(req, res) {
  req.log.debug('Get jwt for authentication');
  // TODO get JWT token
  const jwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6eyJlbWFpbEFkZHJlc3MiOiJ0ZXN0QHRlc3QuY29tIiwibHBhQ29kZSI6IkU2OTk5OTk5OSJ9LCJleHAiOjE5MTIyMzUwODYwMDB9.BMBIJRzEF93_3bTWIX9PKMXm0Vn3OX4FjpftZMuyZjk';
  res.cookie(config.auth.cookie.name, jwt, {
    maxAge: config.auth.cookie.maxAge,
    httpOnly: true,
  });

  req.log.debug('JWT cookie set with success');
  return res.redirect(req.userData.redirectURL);
}

module.exports = {
  login,
};
