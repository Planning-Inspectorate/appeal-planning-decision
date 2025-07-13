// @ts-nocheck
/// <reference types="cypress"/>

import { BasePage } from "../../../../page-objects/base-page";
export class ConstraintsAndDesignations {
    _selectors = {
        affectedListedBuildingNumber: '#affectedListedBuildingNumber',
        changedListedBuildingNumber: '#changedListedBuildingNumber',
        designatedSitesSSSI: '#designatedSites',
        designatedSites2cSAC: '#designatedSites-2',
        designatedSites3SAC: '#designatedSites-3',
        designatedSites4pSPA: '#designatedSites-4',
        designatedSites5SPA: '#designatedSites-5',
        designatedSites6other: '#designatedSites-6',
        conditionalDesignatedSites6other: '#designatedSites_otherDesignations',
        designatedSites8no: '#designatedSites-8'
    }
    selectCorrectTypeOfAppeal(context) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isCorrectTypeOfAppeal) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectChangesListedBuilding(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isChangesListedBuilding) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.get('body').then($body => {
                if ($body.find(`.govuk-fieldset__heading:contains(${lpaManageAppealsData?.constraintsAndDesignations?.addChangedListedBuilding})`).length > 0) {
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                } else {
                    cy.get(this._selectors?.changedListedBuildingNumber).type(lpaManageAppealsData?.constraintsAndDesignations?.changedListedBuildingNumber)
                    cy.advanceToNextPage();
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                }
            })
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectAffectListedBuildings(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isAffectListedBuildings) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.get('body').then($body => {
                if ($body.find(`.govuk-fieldset__heading:contains(${lpaManageAppealsData?.constraintsAndDesignations?.addAnotherBuilding})`).length > 0) {
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                } else {
                    cy.get(this._selectors?.affectedListedBuildingNumber).type(lpaManageAppealsData?.constraintsAndDesignations?.listedBuildingNumber)
                    cy.advanceToNextPage();
                    cy.getByData(basePage?._selectors.answerNo).click();
                    cy.advanceToNextPage();
                }
            })
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectPreserverGrantLoan(context) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isSection3aGrant) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };

    selectConsultHistoricEngland(context) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isConsultHistoricEngland) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadConsultationHistoricEngland);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };

    selectAffectScheduledMonument(context) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isScheduleMonument) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectConservationArea(context) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isConservationArea) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload conservation map and guidance	
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadConservationMapGuidance);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectProtectedSpecies(context) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isProtectedSpecies) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectGreenBelt(context) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isGreenBelt) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
    selectAreaOfOutstandingNaturalBeauty(context, lpaManageAppealsData) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isAreaOutstandingBeauty) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
        if (context?.constraintsAndDesignations?.isAllDesignatedSite) {
            basePage.clickCheckBox(this._selectors?.designatedSitesSSSI);
            basePage.clickCheckBox(this._selectors?.designatedSites2cSAC);
            basePage.clickCheckBox(this._selectors?.designatedSites3SAC);
            basePage.clickCheckBox(this._selectors?.designatedSites4pSPA);
            basePage.clickCheckBox(this._selectors?.designatedSites5SPA);
            cy.get(this._selectors?.designatedSites6other).then(($checkbox) => {
                if (!$checkbox.is(':checked')) {
                    basePage.clickCheckBox(this._selectors?.designatedSites6other);
                }
            });
            basePage.addTextField(this._selectors?.conditionalDesignatedSites6other, lpaManageAppealsData?.constraintsAndDesignations?.designatedSitesOtherDesignations);
        } else {
            cy.get(this._selectors?.designatedSites8no).then(($checkbox) => {
                if (!$checkbox.is(':checked')) {
                    basePage.clickCheckBox(this._selectors?.designatedSites8no);
                }
            });
        }
        cy.advanceToNextPage();
    };

    selectTreePreservationOrder(context) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isTreePreservationOrder) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload a plan showing the extent of the order
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadPlanExtentOrder);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };

    selectGypsyTraveller(context) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isGypsyTraveller) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };

    selectPublicRightOfWay(context) {
        const basePage = new BasePage();
        if (context?.constraintsAndDesignations?.isPublicRightOfWay) {
            cy.getByData(basePage?._selectors.answerYes).click();
            cy.advanceToNextPage();
            //Upload the definitive map and statement extract
            cy.uploadFileFromFixtureDirectories(context?.documents?.uploadDefinitiveMapStmt);
            cy.advanceToNextPage();
        } else {
            cy.getByData(basePage?._selectors.answerNo).click();
            cy.advanceToNextPage();
        }
    };
}
