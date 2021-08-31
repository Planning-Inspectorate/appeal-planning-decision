import { And, Given, Then, When } from 'cypress-cucumber-preprocessor/steps';
import verifyPage from '../../support/common/verifyPage';
import verifyNotificationBanner from '../../support/common/verifyNotificationBanner';
import validateErrorMessage from '../../support/common/validateErrorMessage';
import goToPage from '../../support/common/goToPage';
import clickLink from '../../support/common/clickLink';
import clickSubmit from '../../support/common/clickSubmitButton';
import hasLink from '../../support/common/hasLink';
import inputEmailAddress from '../../support/magic-link/inputEmailAddress';
import authenticateLPA from '../../support/magic-link/authenticateLPA';
import getMagicLink from '../../support/magic-link/getMagicLink';
import getMagicLinkEmail from '../../support/magic-link/getMagicLinkEmail';
import createAuthToken from '../../support/magic-link/createAuthToken';

const lpaCode = 'E69999999';
const enterEmailAddressLink = 'authentication/your-email';
const confirmEmailAddressLink = 'authentication/confirm-email';
const questionnairePage = 'task-list';
const lpaName = 'System Test Borough Council';

Given('LPA wants to access a questionnaire', () => {
  // nothing to do here
});

Given('the LPA is on the confirm your email page', () => {
  goToPage(confirmEmailAddressLink, lpaCode);
});

Given('LPA user receives a magic link for accessing the questionnaire', () => {
  goToPage(enterEmailAddressLink, lpaCode);
  inputEmailAddress();
  clickSubmit();
});

And('is trying to access the LPA questionnaire', () => {
  // nothing to do here
});

Given('access to the questionnaire is requested', () => {
  goToPage(enterEmailAddressLink, lpaCode);
});

Given('LPA user wants to have the magic link resent to them', () => {
  goToPage(confirmEmailAddressLink, lpaCode);
});

Given('the session has timed out', () => {
  const expiredAuthToken = createAuthToken(new Date(Date.now() - 1000));
  cy.setCookie(Cypress.env('AUTH_COOKIE_NAME'), expiredAuthToken);
});

Given('LPA Planning Officer wants to complete a questionnaire', () => {
  // nothing to do here
});

Given('the LPA Planning Officer has not been authenticated', () => {
  cy.clearCookies();
});

Given('the LPA Planning Officer is authenticated', () => {
  authenticateLPA();
});

When('they click on the link in the start email', () => {
  goToPage(questionnairePage);
});

When('the email address does not match the domain of the LPA from the appeal', () => {
  inputEmailAddress('test@test.gov.uk');
  clickSubmit();
});

When('an email address is not provided', () => {
  inputEmailAddress('');
  clickSubmit();
});

When('the email address provided in not in the correct format', () => {
  inputEmailAddress('invalidEmailAddress');
  clickSubmit();
});

When('a valid email address is provided matching the domain of the LPA', () => {
  inputEmailAddress();
  clickSubmit();
});

When('they select to email the customer support team', () => {
  // nothing to do here
});

When('they select a valid link', () => {
  getMagicLink().then((magicLink) => goToPage(magicLink));
});

When('they select an expired magic link', () => {
  goToPage('/authentication/your-email/link-expired', lpaCode);
});

When('they select ‘resend the email’', () => {
  clickLink('resend-email-link');
});

When('the LPA tries to access the questionnaire', () => {
  goToPage(questionnairePage);
});

Then('enter email address page will be opened in the browser', () => {
  verifyPage(enterEmailAddressLink);
});

Then('enter email address page will be displayed', () => {
  verifyPage(enterEmailAddressLink);
});

Then('a magic link is sent to that email address via Notify', () => {
  getMagicLinkEmail().then((response) => {
    expect(response.body[0].personalisation.magicLinkURL).toExist();
  });
});

Then('a mailto link will be provided', () => {
  hasLink(
    '[data-cy="customer-support-mailto-link"]',
    'mailto:enquiries@planninginspectorate.gov.uk',
  );
});

Then('the questionnaire page is presented', () => {
  verifyPage(questionnairePage);
});

And('a session expired notification banner is displayed on the page', () => {
  verifyPage(`${enterEmailAddressLink}/session-expired`);

  const notificationBody =
    '<p class="govuk-notification-banner__heading">Your session has timed out</p>' +
    `<p class="govuk-body">To return to the questionnaire, you need to enter your ${lpaName} email address.</p>`;
  verifyNotificationBanner('session-expired-notification', 'Session expired', notificationBody);
});

And('a link expired notification banner is displayed on the page', () => {
  verifyPage(`${enterEmailAddressLink}/link-expired`);

  const notificationBody =
    '<p class="govuk-notification-banner__heading">Your link has expired</p>' +
    `<p class="govuk-body">To get a new link, you need to enter your ${lpaName} email address.< /p>`;
  verifyNotificationBanner('link-expired-notification', 'Link expired', notificationBody);
});

Then('progress is made to the confirm your email address page', () => {
  verifyPage(confirmEmailAddressLink);
});

And('a magic link is not sent to the user', () => {
  getMagicLink().then((magicLink) => expect(magicLink).to.be.undefined);
});

Then('progress is halted with an error message to enter an email address', () => {
  verifyPage(enterEmailAddressLink);
  validateErrorMessage(
    'Enter an email address in the correct format, like name@example.com',
    '#email',
    'email',
  );
});
