/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const { getByTestId } = require('@testing-library/dom');
const { default: userEvent } = require('@testing-library/user-event');
const {
  addCookieConsentRejectedListener,
  hideConsentRejectedBanner,
  showCookieConsentRejectedBanner,
} = require('../../../../../src/lib/client-side/cookie/cookie-consent-rejected');

const govUkDisplayNoneCssClass = 'govuk-!-display-none';

const getExampleDom = (isDisplaying = true) => {
  const div = document.createElement('div');

  div.innerHTML = `
<div id="cookie-banner-rejected" data-testid="cookie-banner-rejected" ${
    isDisplaying === false && `class="${govUkDisplayNoneCssClass}"`
  }>
 <button name="cookie_banner_rejected" data-testid="cookie-banner-rejected-button" type="submit"></button>
</div>
    `;

  return div;
};

describe('lib/client-side/cookie/cookie-consent-rejected', () => {
  let document;
  let elementCookieBanner;
  let elementAcknowledgeRejectedButton;

  [
    {
      description: 'banner is showing',
      setupDom: () => getExampleDom(),
      beforeEachAssertions: () =>
        expect(elementCookieBanner).not.toHaveClass(govUkDisplayNoneCssClass),
    },
    {
      description: 'banner is hidden',
      setupDom: () => getExampleDom(false),
      beforeEachAssertions: () => expect(elementCookieBanner).toHaveClass(govUkDisplayNoneCssClass),
    },
  ].forEach(({ description, setupDom, beforeEachAssertions }) => {
    describe(description, () => {
      beforeEach(() => {
        document = setupDom();

        elementCookieBanner = getByTestId(document, 'cookie-banner-rejected');
        elementAcknowledgeRejectedButton = getByTestId(document, 'cookie-banner-rejected-button');

        beforeEachAssertions();
      });

      test('hideConsentRejectedBanner', () => {
        hideConsentRejectedBanner(document);
        expect(elementCookieBanner).toHaveClass(govUkDisplayNoneCssClass);
      });

      test('showCookieConsentRejectedBanner', () => {
        showCookieConsentRejectedBanner(document);
        expect(elementCookieBanner).not.toHaveClass(govUkDisplayNoneCssClass);
      });

      test('addCookieConsentRejectedListener', () => {
        addCookieConsentRejectedListener(document);
        userEvent.click(elementAcknowledgeRejectedButton);
        expect(elementCookieBanner).toHaveClass(govUkDisplayNoneCssClass);
      });
    });
  });
});
