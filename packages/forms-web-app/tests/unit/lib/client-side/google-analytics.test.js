/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const { initialiseGoogleAnalytics } = require('../../../../src/lib/client-side/google-analytics');

describe('lib/client-side/google-analytics', () => {
  beforeEach(() => {
    const gaIdElement = document.createElement('p');
    gaIdElement.id = 'gaId';
    gaIdElement.textContent = 'some-test-value';
    document.body.append(gaIdElement);
    const script = document.createElement('script');
    document.body.appendChild(script);
  });

  test('initialiseGoogleAnalytics', () => {
    initialiseGoogleAnalytics(document);

    expect(document.body).toMatchSnapshot();
  });
});
