// @ts-nocheck
/// <reference types="cypress"/>
import { finalCommentTestCases } from "../../helpers/appellantAAPD/finalCommentData";
import { users } from '../../fixtures/users.js';
const { finalComment } = require('../../support/flows/sections/appellantAAPD/finalComment');
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");

describe('Appellant Full Planning Final Comment submission', { tags: '@S78-appellant-Final-Comment-Submission' }, () => {
        const prepareAppealSelector = new PrepareAppealSelector();
        let prepareAppealData;
        before(() => {
                cy.login(users.appeals.authUser);
        });
        beforeEach(() => {
                cy.fixture('prepareAppealData').then(data => {
                        prepareAppealData = data;
                })
                cy.visit(`${Cypress.config('appeals_beta_base_url')}/appeal/email-address`);
                cy.url().then((url) => {
                        if (url.includes('/appeal/email-address')) {
                                cy.getById(prepareAppealSelector?._selectors?.emailAddress).clear();
                                cy.getById(prepareAppealSelector?._selectors?.emailAddress).type(prepareAppealData?.email?.emailAddress);
                                cy.advanceToNextPage();
                                cy.get(prepareAppealSelector?._selectors?.emailCode).type(prepareAppealData?.email?.emailCode);
                                cy.advanceToNextPage();
                        }
                });
        });
        finalCommentTestCases.forEach((context) => {

                it(`Should validate Appellant Full appeal final comments`, () => {
                        finalComment(context, prepareAppealData, prepareAppealData?.FullAppealType);
                });
        });
});