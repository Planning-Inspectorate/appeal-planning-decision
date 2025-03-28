require('@testing-library/jest-dom');

const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();

process.env.APPEALS_SERVICE_API_URL = 'http://fake.url';
process.env.LOGGER_LEVEL = 'error';
