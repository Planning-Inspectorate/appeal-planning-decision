/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const { initialiseGoogleAnalytics } = require('../../../src/lib/client-side/google-analytics');

describe('lib/client-side/google-analytics', () => {
  const FIXED_SYSTEM_TIME = '2020-11-18T00:00:00Z';

  const fakeGaId = 'some-test-value';

  const setupFakeDom = () => {
    const gaIdElement = document.createElement('p');
    gaIdElement.id = 'gaId';
    gaIdElement.textContent = fakeGaId;
    document.body.append(gaIdElement);
    const script = document.createElement('script');
    document.body.appendChild(script);
  };

  beforeEach(() => {
    jest.resetAllMocks();

    setupFakeDom();

    // https://github.com/facebook/jest/issues/2234#issuecomment-730037781
    jest.useFakeTimers('modern');
    jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('initialiseGoogleAnalytics', () => {
    expect(window.dataLayer).toBe(undefined);

    initialiseGoogleAnalytics(document);

    expect(document.body).toMatchSnapshot();

    expect(window.dataLayer).toHaveLength(2);
    // https://github.com/facebook/jest/issues/8475#issuecomment-495729482
    expect([...window.dataLayer[0]]).toMatchObject(['js', new Date()]);
    expect([...window.dataLayer[1]]).toMatchObject(['config', fakeGaId]);
  });
});
