const findCookieObjectByName = (cookies, name) => cookies.find((cookie) => cookie.name === name);

const expectCookieIsNotDefined = (cookies, cookieName) => {
  const cookieObject = findCookieObjectByName(cookies, cookieName);

  expect(cookieObject).to.be.undefined;
};

const expectCookieToHaveValue = (cookies, cookieName, expectedValue) => {
  const cookieObject = findCookieObjectByName(cookies, cookieName);

  expect(cookieObject).to.exist;
  expect(cookieObject.value).to.equal(expectedValue);
};

const expectExpressSessionCookieIsDefined = (cookies) =>
  expect(findCookieObjectByName(cookies, 'connect.sid')).to.exist;

const expectCookiePolicy = (cookies, expectedPolicy) =>
  expectCookieToHaveValue(cookies, 'cookie_policy', expectedPolicy);

const expectCookiePreferencesSet = (cookies, expectedPreferencesValue) =>
  expectCookieToHaveValue(cookies, 'cookie_preferences_set', expectedPreferencesValue);

module.exports = {
  findCookieObjectByName,
  expectCookieIsNotDefined,
  expectExpressSessionCookieIsDefined,
  expectCookiePolicy,
  expectCookiePreferencesSet,
};
