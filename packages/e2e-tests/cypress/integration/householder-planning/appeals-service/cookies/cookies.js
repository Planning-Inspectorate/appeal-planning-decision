export const findCookieObjectByName = (cookies, name) => cookies.find((cookie) => cookie.name === name);

export const expectCookieIsDefined = (cookies, cookieName) => {
  expect(findCookieObjectByName(cookies, cookieName)).to.exist;
};

export const expectCookieIsNotDefined = (cookies, cookieName) => {
  const cookieObject = findCookieObjectByName(cookies, cookieName);

  expect(cookieObject).to.be.undefined;
};

export const expectCookieToHaveValue = (cookies, cookieName, expectedValue) => {
  const cookieObject = findCookieObjectByName(cookies, cookieName);

  expect(cookieObject).to.exist;
  expect(cookieObject.value).to.equal(expectedValue);
};

export const expectCookiePolicyCookieIsDefined = (cookies) =>
  expectCookieIsDefined(cookies, 'cookie_policy');

export const expectExpressSessionCookieIsDefined = (cookies) =>
  expectCookieIsDefined(cookies, 'connect.sid');

export const expectCookiePolicy = (cookies, expectedPolicy) =>
  expectCookieToHaveValue(cookies, 'cookie_policy', expectedPolicy);

export const expectCookiePreferencesSet = (cookies, expectedPreferencesValue) =>
  expectCookieToHaveValue(cookies, 'cookie_preferences_set', expectedPreferencesValue);

export const cookies = {
  findCookieObjectByName,
  expectCookieIsDefined,
  expectCookieIsNotDefined,
  expectCookiePolicyCookieIsDefined,
  expectExpressSessionCookieIsDefined,
  expectCookiePolicy,
  expectCookiePreferencesSet,
};
