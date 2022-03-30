import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';
import { clickSaveAndContinue } from '../../../../../support/householder-planning/appeals-service/appeal-navigation/clickSaveAndContinue';
import { confirmWholeSiteOwnerAnswered } from '../../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/confirmWholeSiteOwnerAnswered';
import { confirmOtherSiteOwnerToldAnswered } from '../../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/confirmOtherSiteOwnerToldAnswered';
import { confirmSiteOwnershipRejectedBecause } from '../../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/confirmSiteOwnershipRejectedBecause';
import {
  givenAlreadySubmittedAndWholeSiteOwner
} from "../../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/givenAlreadySubmittedAndWholeSiteOwner";
import {
  stateOwnSiteOwner
} from "../../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/stateOwnSiteOwner";
import {
  stateOtherOwnersBeenTold
} from "../../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/stateOtherOwnersBeenTold";
import {
  isOtherOwnerPresented
} from "../../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/isOtherOwnerPresented";
import {
  isComponentUpdated
} from "../../../../../support/householder-planning/appeals-service/appeal-submission-appeal-site-ownership/isComponentUpdated";

Given('the site ownership is presented for the first time', () => {
  givenAlreadySubmittedAndWholeSiteOwner(false);
});

Given('the whole site had previously been confirmed as owned', () => {
  givenAlreadySubmittedAndWholeSiteOwner(true, true);
});

Given('the whole site had previously been confirmed as not owned', () => {
  givenAlreadySubmittedAndWholeSiteOwner(true, false);
});

Given('confirmation of additional site owners notification is requested', () => {
  givenAlreadySubmittedAndWholeSiteOwner(true, false);
  clickSaveAndContinue();
});

When('the user does not state being or not the whole site owner', () => {
  clickSaveAndContinue();
});

When('the user does not state if other owners have been told', () => {
  clickSaveAndContinue();
});

When('no confirmation is provided that the whole site is owned', () => {
  clickSaveAndContinue();
});

When('no confirmation of notification of additional site owners is provided', () => {
  clickSaveAndContinue();
});

When('it is confirmed that the whole site is owned', () => {
  stateOwnSiteOwner(true);
});

When('it is confirmed that the whole site is not owned', () => {
  stateOwnSiteOwner(false);
});

When('it is confirmed that additional site owners have been notified', () => {
  stateOtherOwnersBeenTold(true);
});
When('it is confirmed that additional site owners have not been notified', () => {
  stateOtherOwnersBeenTold(false);
});

Then('a request to notify additional owners is presented', () => {
  isOtherOwnerPresented(true);
});

Then('a request to notify additional owners is not presented', () => {
  isOtherOwnerPresented(false);
});

Then('a request to confirm access to the site is presented', () => {
  isOtherOwnerPresented(false);
});

Then('confirmation of whole site ownership is requested', () => {
  confirmSiteOwnershipRejectedBecause('Select yes if you own the whole appeal site');
  confirmWholeSiteOwnerAnswered('blank');
});

Then('confirmation of notification of additional site owners is requested', () => {
  confirmSiteOwnershipRejectedBecause('Select yes if you have told the other owners');
  confirmOtherSiteOwnerToldAnswered('blank');
});

Then('the site is updated to be wholly owned on the appeal', () => {
  isComponentUpdated('site ownership', 'yes');
  isComponentUpdated('other owners told', 'blank');
});

Then('the site is updated to not be wholly owned on the appeal', () => {
  isComponentUpdated('site ownership', 'no');
});

Then('the site is updated so that other owners been notified on the appeal', () => {
  isComponentUpdated('other owners told', 'yes');
});
Then('the site is updated so that other owners have not been notified on the appeal', () => {
  isComponentUpdated('other owners told', 'no');
});
