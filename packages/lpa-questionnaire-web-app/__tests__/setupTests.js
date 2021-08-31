process.env.JWT_SIGNING_KEY = 'mockSigningKey';
process.env.TOKEN_COOKIE_NAME = 'mockAuthCookieName';

const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();
