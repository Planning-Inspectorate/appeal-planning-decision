const { body } = require('express-validator');

const validUsageCookieOptions = ['on', 'off'];

const ruleUsageCookie = () =>
  body('usage-cookies')
    .if((value) => value)
    .isIn(validUsageCookieOptions);

const rules = () => [ruleUsageCookie()];

module.exports = {
  rules,
  validUsageCookieOptions,
};
