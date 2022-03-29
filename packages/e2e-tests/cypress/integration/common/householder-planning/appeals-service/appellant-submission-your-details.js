import {When, Then, Given} from 'cypress-cucumber-preprocessor/steps';
import { provideApplicantName } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideApplicantName';
import { clickSaveAndContinue } from '../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { confirmApplicantNameWasAccepted } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmApplicantNameWasAccepted';
import { confirmApplicantNameWasRejected } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmApplicantNameWasRejected';
import { confirmApplicantNameValue } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmApplicantNameValue';
import { provideDetailsName } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideDetailsName';
import { provideDetailsEmail } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideDetailsEmail';
import { confirmYourDetailsStatus } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmYourDetailsStatus';
import { confirmOriginalApplicantName } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmOriginalApplicantName';
import { provideNameOfOriginalApplicant } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideNameOfOriginalApplicant';
import { confirmDetailsWasAccepted } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmDetailsWasAccepted';
import { confirmDetailsWasRejected } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmDetailsWasRejected';
import { confirmOriginalApplicantWasRejected } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmOriginalApplicantWasRejected';
import { confirmNameValue } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmNameValue';
import { confirmEmailValue } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmEmailValue';
import { confirmNameValueNotSet } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmNameValueNotSet';
import { confirmEmailValueNotSet } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmEmailValueNotSet';
import { provideAnswerYes } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideAnswerYes';
import { provideAnswerNo } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideAnswerNo';
import { confirmNavigationYourDetailsPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/appellant-submission/confirmNavigationYourDetailsPage';
import { confirmOriginalAppellantAsked } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmOriginalAppellantAsked';
import { confirmOriginalAppellantNotAsked } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmOriginalAppellantNotAsked';
import { confirmAnswered } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmAnswered';
import { confirmWhoAreYouRejectedBecause } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmWhoAreYouRejectedBecause';
import { confirmNavigationWhoAreYouPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/appellant-submission/confirmNavigationWhoAreYouPage';
import { confirmNavigationTaskListPage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/appellant-submission/confirmNavigationTaskListPage';
import { confirmNavigationApplicantNamePage } from '../../../../support/householder-planning/appeals-service/appeal-navigation-confirmation/appellant-submission/confirmNavigationApplicantNamePage';
import { confirmAreYouOriginalApplicant } from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/confirmAreYouOriginalApplicant';
import { goToAppealsPage } from '../../../../support/common/go-to-page/goToAppealsPage';
import { pageURLAppeal } from './pageURLAppeal';
import {
  provideAreYouOriginalApplicant
} from '../../../../support/householder-planning/appeals-service/appellant-submission-your-details/provideAreYouOriginalApplicant';
import { linkYourDetails } from '../../../../support/householder-planning/appeals-service/page-objects/task-list-po';

When('the user provides the name {string}', (name) => {
  goToAppealsPage(pageURLAppeal.goToApplicantNamePage);
  provideApplicantName(name);
  clickSaveAndContinue();
});

When('the user does not provides the name', () => {
  goToAppealsPage(pageURLAppeal.goToApplicantNamePage);
 clickSaveAndContinue();
});

Then('the user can proceed', () => {
 confirmApplicantNameWasAccepted();
});

When('the user is informed that the name is missing', () => {
 confirmApplicantNameWasRejected('Enter the name you are appealing for');
});

Then('the user is informed that the provided name has a bad format', () => {
 confirmApplicantNameWasRejected(
    'Name must only include letters a to z, hyphens, spaces and apostrophes',
  );
});

Then(
  'the user can see that their appeal has {string} updated with the provided name {string}',
  (updated, name) => {
    if (updated === 'been') {
     confirmApplicantNameValue(name);
    } else {
     confirmApplicantNameValue('');
    }
  },
);

Given('appeal is made on behalf of another applicant', () => {
 goToAppealsPage(pageURLAppeal.goToTaskListPage);
 linkYourDetails().click();
 provideAreYouOriginalApplicant('no');
 clickSaveAndContinue();
 provideDetailsName('Valid Name');
 provideDetailsEmail('valid@email.com');
 clickSaveAndContinue();
})

Given('the user has confirmed that they {string} the original applicant', (areOrAreNot) => {
 goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
 provideAreYouOriginalApplicant(areOrAreNot);
 clickSaveAndContinue();
})

And('Your Details section is {string}', (status) => {
 goToAppealsPage(pageURLAppeal.goToTaskListPage);
 confirmYourDetailsStatus(status.toUpperCase());
})

And('appeal is updated with the original applicant', () => {
 goToAppealsPage(pageURLAppeal.goToApplicantNamePage);
 confirmOriginalApplicantName('Original Applicant')
})

And('appeal is updated with the original applicant {string}', (originalApplicant) => {
  goToAppealsPage(pageURLAppeal.goToApplicantNamePage);
 confirmOriginalApplicantName(originalApplicant)
})

And('appeal is not updated with the original applicant {string}', (originalApplicant) => {
  goToAppealsPage(pageURLAppeal.goToApplicantNamePage);
 confirmOriginalApplicantName('')
})

And('the user can see that their appeal {string} been updated to show that they are acting on behalf of {string}', (hasOrHasNot, originalApplicant) => {
  goToAppealsPage(pageURLAppeal.goToApplicantNamePage);
  if (hasOrHasNot === 'has') {
   confirmOriginalApplicantName(originalApplicant)
  } else {
   confirmOriginalApplicantName('')
  }
})

When('original applicant name is submitted', () => {
 goToAppealsPage(pageURLAppeal.goToApplicantNamePage);
 provideNameOfOriginalApplicant('Original Applicant');
 clickSaveAndContinue();
})

When('original applicant name {string} is submitted', (originalApplicant) => {
 goToAppealsPage(pageURLAppeal.goToApplicantNamePage);
 provideNameOfOriginalApplicant(originalApplicant);
 clickSaveAndContinue();
})

Given('name and email are requested again where appellant is the original applicant', () => {
 provideAreYouOriginalApplicant('yes')
 clickSaveAndContinue();
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 provideDetailsName('Valid Name');
 provideDetailsEmail('valid@email.com');
 clickSaveAndContinue();
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
});

Given('name and email are requested again where appellant is not the original applicant', () => {
 provideAreYouOriginalApplicant('no')
 clickSaveAndContinue();
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 provideDetailsName('Valid Name');
 provideDetailsEmail('valid@email.com');
 clickSaveAndContinue();
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
});

Given('name and email are requested where appellant is the original applicant', () => {
 provideAreYouOriginalApplicant('yes')
 clickSaveAndContinue();
 cy.url().should('contain',pageURLAppeal.goToYourDetailsPage);
});

Given('name and email are requested where appellant is not the original applicant', () => {
 provideAreYouOriginalApplicant('no')
 clickSaveAndContinue();
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
});

Given('name and email are requested again', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 provideDetailsName('Valid Name');
 provideDetailsEmail('valid@email.com');
 clickSaveAndContinue();
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
});

Given('name and email are requested', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
});

Given('appeal does contain name and email', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 provideDetailsName('Valid Name');
 provideDetailsEmail('valid@email.com');
 clickSaveAndContinue();
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
});

Given('the user {string} previously provided their name or email', (hasOrHasNot) => {
  goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
  if (hasOrHasNot === 'has') {
   provideDetailsName('Valid Name');
   provideDetailsEmail('valid@email.com');
   clickSaveAndContinue();
  }
  goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
});

When('{string} and {string} are submitted', (name, email) => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 provideDetailsName(name);
 provideDetailsEmail(email);
 clickSaveAndContinue();
});

When('new valid name and email are submitted', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 provideDetailsName('New Valid Name');
 provideDetailsEmail('new-valid@email.com');
 clickSaveAndContinue();
});

When('new invalid name and email are submitted', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 provideDetailsName('Invalid name with prohibited characters *3(/+');
 provideDetailsEmail('invalid email');
 clickSaveAndContinue();
});

When('the user provides their {string} and {string}', (name, email) => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 provideDetailsName(name);
 provideDetailsEmail(email);
 clickSaveAndContinue();
});

When('the user provides the name {string}', (name) => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 provideDetailsName(name);
 provideDetailsEmail('good@email.com');
 clickSaveAndContinue();
});

When('the user provides the email {string}', (email) => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 provideDetailsName('Good Name');
 provideDetailsEmail(email);
 clickSaveAndContinue();
});

When('the user provides only a name', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 provideDetailsName('Good Name');
 clickSaveAndContinue();
});

When('the user provides only an email', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 provideDetailsEmail('good@email.com');
 clickSaveAndContinue();
});

Then("the appeal's Your Details task is completed with {string} and {string}", (name, email) => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 confirmDetailsWasAccepted(name, email);
});

Then('name {string} is invalid because {string}', (name, reason) => {
  switch (reason) {
    case 'name missing':
     confirmDetailsWasRejected('Enter your name');
      break;
    case 'name outside size constraints':
     confirmDetailsWasRejected('Name must be between 2 and 80 characters');
      break;
    case 'name with prohibited characters':
     confirmDetailsWasRejected('Name must only include letters a to z, hyphens, spaces and apostrophes');
      break;
    default:
      throw new Error(`test fails here because it could not find the reason [${reason}] in the list of cases`)
  }
});

Then('email {string} is invalid because {string}', (email, reason) => {
  switch (reason) {
    case 'email missing':
     confirmDetailsWasRejected('Enter your email');
      break;
    case 'email invalid':
     confirmDetailsWasRejected('Enter an email address in the correct format, like name@example.com');
      break;
    default:
      throw new Error(`test fails here because it could not find the reason [${reason}] in the list of cases`)
  }
});

Then('the user is informed that the provided value {string} is invalid because {string}', (nameOrEmail, reason) => {
  switch (reason) {
    case 'name missing':
     confirmDetailsWasRejected('Enter your name');
      break;
    case 'name outside size constraints':
     confirmDetailsWasRejected('Name must be between 2 and 80 characters');
      break;
    case 'name with prohibited characters':
     confirmDetailsWasRejected('Name must only include letters a to z, hyphens, spaces and apostrophes');
      break;
    case 'email missing':
     confirmDetailsWasRejected('Enter your email');
      break;
    case 'email invalid':
     confirmDetailsWasRejected('Enter an email address in the correct format, like name@example.com');
      break;
    default:
      throw new Error(`test fails here because it could not find the reason [${reason}] in the list of cases`)
  }
});

Then('original applicant value {string} is invalid because {string}', (originalApplicant, reason) => {
  switch (reason) {
    case 'name missing':
     confirmOriginalApplicantWasRejected('Enter the name you are appealing for');
      break;
    case 'name outside size constraints':
     confirmOriginalApplicantWasRejected('Name must be between 2 and 80 characters');
      break;
    case 'name with prohibited characters':
     confirmOriginalApplicantWasRejected('Name must only include letters a to z, hyphens, spaces and apostrophes');
      break;
    default:
      throw new Error(`test fails here because it could not find the reason [${reason}] in the list of cases`)
  }
});

Then('the user is informed that the provided name is invalid', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 confirmDetailsWasRejected(
    'Name must only include letters a to z, hyphens, spaces and apostrophes',
  );
});

Then('the user is informed that the provided email is invalid', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 confirmDetailsWasRejected('Enter an email address in the correct format, like name@example.com');
});

Then('the user is informed that the name is missing', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 confirmDetailsWasRejected('Enter your name');
});

Then('the user is informed that the email is missing', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 confirmDetailsWasRejected('Enter your email address');
});

Then(
  'appeal is updated with new valid name and email', () => {
   goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
   confirmNameValue('New Valid Name');
   confirmEmailValue('new-valid@email.com');
  },
);

Then(
  'appeal is updated with {string} and {string}', (name, email) => {
   goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
   confirmNameValue(name);
   confirmEmailValue(email);
  },
);

Then(
  'the user can see that their appeal has been updated with {string} and {string}', (name, email) => {
   goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
   confirmNameValue(name);
   confirmEmailValue(email);
  },
);

Then('the user can see that their appeal has not been updated with {string}', (notUpdated) => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
  if (notUpdated.includes('name')) {
   confirmNameValue('');
  }

  if (notUpdated.includes('email')) {
   confirmEmailValue('');
  }
});

Then('appeal is not updated', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 confirmNameValueNotSet()
 confirmEmailValueNotSet()
});

Then('appeal is not updated again', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 confirmNameValue('Valid Name')
 confirmEmailValue('valid@email.com')
});

Then('the user can see that their appeal has not been updated', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 confirmNameValueNotSet()
 confirmEmailValueNotSet()
});

Then('appeal is not updated with new name and email values', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 confirmNameValue('Valid Name');
 confirmEmailValue('valid@email.com');
});

Then('the user can see that their appeal has not been updated with new values', () => {
 goToAppealsPage(pageURLAppeal.goToYourDetailsPage);
 confirmNameValue('Valid Name');
 confirmEmailValue('valid@email.com');
});

Given('the user {string} previously stated {string} the original appellant', (alreadySubmitted, originalAppellant) => {
  goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
  if (alreadySubmitted === 'had') {
    if (originalAppellant === 'being') {
      provideAnswerYes();
        } else {
     provideAnswerNo();
    }
   clickSaveAndContinue();
   confirmNavigationYourDetailsPage();
  }
  goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);

});

When('the user does not state being or not the original appellant', () => {
 clickSaveAndContinue();
});


When('the user states that they {string} the original appellant', (original) => {
  if (original === 'yes') {
   provideAnswerYes();
  } else {
   provideAnswerNo();
  }
 clickSaveAndContinue();
});

Then('the user will {string} asked who they are representing', (asked) => {
 provideDetailsName('Good Name');
 provideDetailsEmail('good@email.com');
 clickSaveAndContinue();

  if (asked === 'be') {
   confirmOriginalAppellantAsked();
  } else {
   confirmOriginalAppellantNotAsked();
  }
});

Then('the user can see that their appeal has been updated with the {string} answer', (answer) => {
  goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
 confirmAnswered(answer);
});

Then('the user is informed that he must answer', (answer) => {
 confirmAnswered(answer);
});

Then('the user is told {string}', (message) => {
 confirmWhoAreYouRejectedBecause(message);
});


And('original applicant status is presented', () => {
 confirmNavigationWhoAreYouPage();
})

And('name and email are presented', () => {
 confirmNavigationYourDetailsPage();
})

And('appeal tasks are presented', () => {
 confirmNavigationTaskListPage();
})

And('applicant name is presented', () => {
 confirmNavigationApplicantNamePage();
})


Given('confirmation of whether appellant is original applicant is requested', () => {
  goToAppealsPage(pageURLAppeal.goToTaskListPage);
  linkYourDetails().click();
  cy.url().should('contain', pageURLAppeal.goToWhoAreYouPage);
})

Given('confirmation about original applicant is not provided', () => {
 clickSaveAndContinue();
})

Given('confirmation provided that appellant is original applicant', () => {
 provideAreYouOriginalApplicant('yes')
 clickSaveAndContinue();
})

Given('confirmation provided that appellant is not original applicant', () => {
 provideAreYouOriginalApplicant('no')
 clickSaveAndContinue();
})

Given('it is confirmed that appellant {string} original applicant', (isOrIsNot) => {
  if (isOrIsNot === 'is') {
   provideAreYouOriginalApplicant('yes')
  } else {
   provideAreYouOriginalApplicant('no');
  }
 clickSaveAndContinue();
})


Then('appeal is not updated because confirmation of original applicant status is required', () => {
 confirmWhoAreYouRejectedBecause('Select yes if the original planning application was made in your name');
 confirmAreYouOriginalApplicant('not set');
})


Then('appeal is updated to show appellant is original applicant', () => {
  goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
 confirmAreYouOriginalApplicant('yes');
})

Then('appeal is updated to show appellant is not original applicant', () => {
  goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
 confirmAreYouOriginalApplicant('no');
})

Then('appeal is updated to show appellant {string} original applicant', (isOrIsNot) => {
  goToAppealsPage(pageURLAppeal.goToWhoAreYouPage);
  if (isOrIsNot === 'is') {
   confirmAreYouOriginalApplicant('yes');
  } else {
   confirmAreYouOriginalApplicant('no');
  }

})
