import {When, Then, Given} from 'cypress-cucumber-preprocessor/steps';

When('the user provides the name {string}', (name) => {
  cy.goToApplicantNamePage();
  cy.provideApplicantName(name);
  cy.clickSaveAndContinue();
});

When('the user does not provides the name', () => {
  cy.goToApplicantNamePage();
  cy.clickSaveAndContinue();
});

Then('the user can proceed', () => {
  cy.confirmApplicantNameWasAccepted();
});

When('the user is informed that the name is missing', () => {
  cy.confirmApplicantNameWasRejected('Enter the name you are appealing for');
});

Then('the user is informed that the provided name has a bad format', () => {
  cy.confirmApplicantNameWasRejected(
    'Name must only include letters a to z, hyphens, spaces and apostrophes',
  );
});

Then(
  'the user can see that their appeal has {string} updated with the provided name {string}',
  (updated, name) => {
    if (updated === 'been') {
      cy.confirmApplicantNameValue(name);
    } else {
      cy.confirmApplicantNameValue('');
    }
  },
);

Given('the user has provided valid name and email after indicating that they are are applying on behalf of another applicant', () => {
  cy.goToWhoAreYouPage()
  cy.provideAreYouOriginalApplicant('are not');
  cy.clickSaveAndContinue();
  cy.goToYourDetailsPage();
  cy.provideDetailsName('Valid Name');
  cy.provideDetailsEmail('valid@email.com');
  cy.clickSaveAndContinue();
})

Given('the user has confirmed that they {string} the original applicant', (areOrAreNot) => {
  cy.goToWhoAreYouPage()
  cy.provideAreYouOriginalApplicant(areOrAreNot);
  cy.clickSaveAndContinue();
})

And('the Your Details section is {string}', (status) => {
  cy.goToTaskListPage()
  cy.confirmYourDetailsStatus(status.toUpperCase());
})

And('the user can see that their appeal {string} been updated to show that they are acting on behalf of {string}', (hasOrHasNot, originalApplicant) => {
  cy.goToApplicantNamePage();
  if (hasOrHasNot === 'has') {
    cy.confirmOriginalApplicantName(originalApplicant)
  } else {
    cy.confirmOriginalApplicantName('')
  }
})

When('the user provides the name of the original applicant {string}', (originalApplicant) => {
  cy.goToApplicantNamePage();
  cy.provideNameOfOriginalApplicant(originalApplicant);
  cy.clickSaveAndContinue();
})

Given('the user {string} previously provided their name or email', (hasOrHasNot) => {
  cy.goToYourDetailsPage();
  if (hasOrHasNot === 'has') {
    cy.provideDetailsName('Valid Name');
    cy.provideDetailsEmail('valid@email.com');
    cy.clickSaveAndContinue();
  }
  cy.goToYourDetailsPage();
});

When('the user provides their {string} and {string}', (name, email) => {
  cy.goToYourDetailsPage();
  cy.provideDetailsName(name);
  cy.provideDetailsEmail(email);
  cy.clickSaveAndContinue();
});

When('the user provides the name {string}', (name) => {
  cy.goToYourDetailsPage();
  cy.provideDetailsName(name);
  cy.provideDetailsEmail('good@email.com');
  cy.clickSaveAndContinue();
});

When('the user provides the email {string}', (email) => {
  cy.goToYourDetailsPage();
  cy.provideDetailsName('Good Name');
  cy.provideDetailsEmail(email);
  cy.clickSaveAndContinue();
});

When('the user provides only a name', () => {
  cy.goToYourDetailsPage();
  cy.provideDetailsName('Good Name');
  cy.clickSaveAndContinue();
});

When('the user provides only an email', () => {
  cy.goToYourDetailsPage();
  cy.provideDetailsEmail('good@email.com');
  cy.clickSaveAndContinue();
});

Then("the appeal's Your Details task is completed with {string} and {string}", (name, email) => {
  cy.goToYourDetailsPage();
  cy.confirmDetailsWasAccepted(name, email);
});

Then('the user is informed that the provided value {string} is invalid because {string}', (nameOrEmail, reason) => {
  switch (reason) {
    case 'name missing':
      cy.confirmDetailsWasRejected('Enter your name');
      break;
    case 'name outside size constraints':
      cy.confirmDetailsWasRejected('Name must be between 2 and 80 characters');
      break;
    case 'name with prohibited characters':
      cy.confirmDetailsWasRejected('Name must only include letters a to z, hyphens, spaces and apostrophes');
      break;
    case 'email missing':
      cy.confirmDetailsWasRejected('Enter your email');
      break;
    case 'email invalid':
      cy.confirmDetailsWasRejected('Email should be a valid email address');
      break;
    default:
      throw new Error(`test fails here because it could not find the reason [${reason}] in the list of cases`)
  }
});

Then('the user is informed that the provided original applicant value {string} is invalid because {string}', (originalApplicant, reason) => {
  switch (reason) {
    case 'name missing':
      cy.confirmOriginalApplicantWasRejected('Enter the name you are appealing for');
      break;
    case 'name outside size constraints':
      cy.confirmOriginalApplicantWasRejected('Name must be between 2 and 80 characters');
      break;
    case 'name with prohibited characters':
      cy.confirmOriginalApplicantWasRejected('Name must only include letters a to z, hyphens, spaces and apostrophes');
      break;
    default:
      throw new Error(`test fails here because it could not find the reason [${reason}] in the list of cases`)
  }
});

Then('the user is informed that the provided name is invalid', () => {
  cy.goToYourDetailsPage();
  cy.confirmDetailsWasRejected(
    'Name must only include letters a to z, hyphens, spaces and apostrophes',
  );
});

Then('the user is informed that the provided email is invalid', () => {
  cy.goToYourDetailsPage();
  cy.confirmDetailsWasRejected('Email should be a valid email address');
});

Then('the user is informed that the name is missing', () => {
  cy.goToYourDetailsPage();
  cy.confirmDetailsWasRejected('Enter your name');
});

Then('the user is informed that the email is missing', () => {
  cy.goToYourDetailsPage();
  cy.confirmDetailsWasRejected('Enter your email address');
});

Then(
  'the user can see that their appeal has been updated with {string} and {string}', (name, email) => {
    cy.goToYourDetailsPage();
    cy.confirmNameValue(name);
    cy.confirmEmailValue(email);
  },
);

Then('the user can see that their appeal has not been updated with {string}', (notUpdated) => {
  cy.goToYourDetailsPage();
  if (notUpdated.includes('name')) {
    cy.confirmNameValue('');
  }

  if (notUpdated.includes('email')) {
    cy.confirmEmailValue('');
  }
});

Then('the user can see that their appeal has not been updated', () => {
  cy.goToYourDetailsPage();
  cy.confirmNameValueNotSet()
  cy.confirmEmailValueNotSet()
});


Then('the user can see that their appeal has not been updated with new values', () => {
  cy.goToYourDetailsPage();
  cy.confirmNameValue('Valid Name');
  cy.confirmEmailValue('valid@email.com');
});

Given('the user {string} previously stated {string} the original appellant', (alreadySubmitted, originalAppellant) => {
  cy.goToWhoAreYouPage();
  if (alreadySubmitted === 'had') {
    if (originalAppellant === 'being') {
      cy.answerYesOriginalAppellant();
    } else {
      cy.answerNoOriginalAppellant();
    }
    cy.clickSaveAndContinue();
    cy.confirmNavigationYourDetailsPage();
  }
  cy.goToWhoAreYouPage();

});

When('the user does not state being or not the original appellant', () => {
  cy.clickSaveAndContinue();
});


When('the user states that they {string} the original appellant', (original) => {
  if (original === 'are') {
    cy.answerYesOriginalAppellant();
  } else {
    cy.answerNoOriginalAppellant();
  }
  cy.clickSaveAndContinue();
});

Then('the user will {string} asked who they are representing', (asked) => {
  cy.provideDetailsName('Good Name');
  cy.provideDetailsEmail('good@email.com');
  cy.clickSaveAndContinue();

  if (asked === 'be') {
    cy.confirmOriginalAppellantAsked();
  } else {
    cy.confirmOriginalAppellantNotAsked();
  }
});

Then('the user can see that their appeal has been updated with the {string} answer', (answer) => {
  cy.goToWhoAreYouPage();
  cy.confirmAnswered(answer);
});

Then('the user is informed that he must answer', (answer) => {
  cy.confirmAnswered(answer);
});

Then('the user is told {string}', (message) => {
  cy.confirmWhoAreYouPageRejectedBecause(message);
});
