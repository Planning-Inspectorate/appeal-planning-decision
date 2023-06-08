import { BasePage } from "./base-page";
import { ApplicationNumber } from "./before-you-start/planning-application-number";
import { EmailAddressInput } from "./before-you-start/email-address";
import { EnterFiveCode } from "./before-you-start/enter-code";

const basePage = new BasePage
const applicationNumber = new ApplicationNumber
const emailAddressInput = new EmailAddressInput
const enterFiveCode = new EnterFiveCode

export class ProfileCreation {

    planningInformation() {
        basePage.clickSaveAndContiuneBtn();
        applicationNumber.enterAppNumber('111111');
        basePage.clickSaveAndContiuneBtn();
        emailAddressInput.enterEmailAddress('');
        basePage.clickSaveAndContiuneBtn();
        enterFiveCode.enterCode('');
        basePage.clickSaveAndContiuneBtn();
        cy.url().should('include', 'email-address-confirmed');
        basePage.clickSaveAndContiuneBtn();
        basePage.clickSaveAndContiuneBtn();
    }
}