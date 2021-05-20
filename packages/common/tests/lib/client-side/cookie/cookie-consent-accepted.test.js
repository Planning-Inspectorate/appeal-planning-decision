/**
 * @jest-environment jsdom
 */
/* eslint-env browser */

const { getByTestId } = require('@testing-library/dom');
const { default: userEvent } = require('@testing-library/user-event');
const {
  addCookieConsentAcceptedListener,
  hideConsentAcceptedBanner,
  showCookieConsentAcceptedBanner,
} = require('../../../../src/lib/client-side/cookie/cookie-consent-accepted');

const govUkDisplayNoneCssClass = 'govuk-!-display-none';

const getExampleDom = (isDisplaying = true) => {
  const div = document.createElement('div');

  div.innerHTML = `
<div id="cookie-banner-accepted" data-testid="cookie-banner-accepted" ${
    isDisplaying === false && `class="${govUkDisplayNoneCssClass}"`
  }>
 <button name="cookie_banner_accepted" data-testid="cookie-banner-accepted-button" type="submit"></button>
</div>
    `;

  return div;
};

describe('lib/client-side/cookie/cookie-consent-accepted', () => {
  let document;
  let elementCookieBanner;
  let elementAcknowledgeAcceptedButton;

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

        elementCookieBanner = getByTestId(document, 'cookie-banner-accepted');
        elementAcknowledgeAcceptedButton = getByTestId(document, 'cookie-banner-accepted-button');

        beforeEachAssertions();
      });

      test('hideConsentAcceptedBanner', () => {
        hideConsentAcceptedBanner(document);
        expect(elementCookieBanner).toHaveClass(govUkDisplayNoneCssClass);
      });

      test('showCookieConsentAcceptedBanner', () => {
        showCookieConsentAcceptedBanner(document);
        expect(elementCookieBanner).not.toHaveClass(govUkDisplayNoneCssClass);
      });

      test('addCookieConsentAcceptedListener', () => {
        addCookieConsentAcceptedListener(document);
        userEvent.click(elementAcknowledgeAcceptedButton);
        expect(elementCookieBanner).toHaveClass(govUkDisplayNoneCssClass);
      });
    });
  });
});
