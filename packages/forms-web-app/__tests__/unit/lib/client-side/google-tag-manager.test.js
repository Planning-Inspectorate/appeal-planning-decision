/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const googleTagManager = require('../../../../src/lib/client-side/google-tag-manager');

describe('lib/client-side/google-tag-manager', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    window.dataLayer = undefined;
  });

  test('grant consent when the Google Tag Manager applyConsent is called', () => {
    expect(window.dataLayer).toBe(undefined);

    googleTagManager.grantConsent();
    expect(window.dataLayer).toHaveLength(1);
    // https://github.com/facebook/jest/issues/8475#issuecomment-495729482
    expect([...window.dataLayer[0]]).toMatchObject([
      'consent',
      'update',
      { analytics_storage: 'granted' },
    ]);
  });

  test('deny consent when the Google Tag Manager denyConsent is called', () => {
    expect(window.dataLayer).toBe(undefined);

    googleTagManager.denyConsent();
    expect(window.dataLayer).toHaveLength(1);
    // https://github.com/facebook/jest/issues/8475#issuecomment-495729482
    expect([...window.dataLayer[0]]).toMatchObject([
      'consent',
      'update',
      { analytics_storage: 'denied' },
    ]);
  });
});
