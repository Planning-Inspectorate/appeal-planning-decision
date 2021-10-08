const jwt = require('jsonwebtoken');
const FOUR_HOURS = 4 * 60 * 60 * 1000;
const DEFAULT_EXP_TIME = new Date(Date.now() + FOUR_HOURS).getTime();

const JWT_PAYLOAD = {
  userInformation: {
    lpaCode: 'E69999999',
    email: 'test@@planninginspectorate.gov.uk',
  },
};

module.exports = (expDateInMillis = DEFAULT_EXP_TIME) => {
  return jwt.sign(
    {
      ...JWT_PAYLOAD,
      exp: expDateInMillis,
    },
    Cypress.env('AUTH_TOKEN_SIGNING_KEY'),
  );
};
