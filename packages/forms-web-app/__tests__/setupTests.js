require('@testing-library/jest-dom');

const { TextEncoder, TextDecoder } = require('util');

const fetchMock = require('jest-fetch-mock');

fetchMock.enableMocks();
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
