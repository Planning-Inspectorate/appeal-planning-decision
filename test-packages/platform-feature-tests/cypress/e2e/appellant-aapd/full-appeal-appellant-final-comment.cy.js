// @ts-nocheck
/// <reference types="cypress"/>
import { finalCommentTestCases } from "../../helpers/representations/finalCommentData";
//appeal-planning-decision\test-packages\platform-feature-tests\cypress\helpers\representations\finalCommentData.js
const { finalComment } = require('../../support/flows/sections/representations/finalComment');
const { PrepareAppealSelector } = require("../../page-objects/prepare-appeal/prepare-appeal-selector");

describe('Appellant Full Planning Proof Of Evidence Test Cases', () => {
        const prepareAppealSelector = new PrepareAppealSelector();
        let prepareAppealData;
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
                finalComment(context, prepareAppealData);
                });
        });
});