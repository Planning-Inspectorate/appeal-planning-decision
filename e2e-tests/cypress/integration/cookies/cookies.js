const findCookieObjectByName = (cookies, name) => cookies.find((cookie) => cookie.name === name);

const expectCookieIsDefined = (cookies, cookieName) => {
  expect(findCookieObjectByName(cookies, cookieName)).to.exist;
};

const expectCookieIsNotDefined = (cookies, cookieName) => {
  const cookieObject = findCookieObjectByName(cookies, cookieName);

  expect(cookieObject).to.be.undefined;
};

const expectCookieToHaveValue = (cookies, cookieName, expectedValue) => {
  const cookieObject = findCookieObjectByName(cookies, cookieName);

  expect(cookieObject).to.exist;
  expect(cookieObject.value).to.equal(expectedValue);
};

const expectCookiePolicyCookieIsDefined = (cookies) =>
  expectCookieIsDefined(cookies, 'cookie_policy');

const expectExpressSessionCookieIsDefined = (cookies) =>
  expectCookieIsDefined(cookies, 'connect.sid');

const expectCookiePolicy = (cookies, expectedPolicy) =>
  expectCookieToHaveValue(cookies, 'cookie_policy', expectedPolicy);

const expectCookiePreferencesSet = (cookies, expectedPreferencesValue) =>
  expectCookieToHaveValue(cookies, 'cookie_preferences_set', expectedPreferencesValue);

module.exports = {
  findCookieObjectByName,
  expectCookieIsDefined,
  expectCookieIsNotDefined,
  expectCookiePolicyCookieIsDefined,
  expectExpressSessionCookieIsDefined,
  expectCookiePolicy,
  expectCookiePreferencesSet,
};
