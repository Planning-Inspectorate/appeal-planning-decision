import { BasePage } from "../../../../page-objects/base-page";
import { AppealProcess } from "../../pages/lpa-manage-appeals/appealProcess";
import { ConstraintsAndDesignations } from "../../pages/lpa-manage-appeals/constraintsAndDesignations";
import { ConsultResponseAndRepresent } from "../../pages/lpa-manage-appeals/consultResponseAndRepresent";
import { NotifyParties } from "../../pages/lpa-manage-appeals/notifyParties";
import { PoReportAndSupportDocs } from "../../pages/lpa-manage-appeals/poReportAndSupportDocs";
import { SiteAccess } from "../../pages/lpa-manage-appeals/siteAccess";

export const lpaQuestionnaire = (context,lpaQuestionnaireData) => {
//module.exports = (context,lpaQuestionnaireData) => {
	const basePage = new BasePage();
	const constraintsAndDesignations = new ConstraintsAndDesignations();
	const consultResponseAndRepresent = new ConsultResponseAndRepresent();
	const appealProcess = new AppealProcess();
	const siteAccess = new SiteAccess();
	const notifyParties = new NotifyParties();
	const poReportAndSupportDocs = new PoReportAndSupportDocs();
	let appealId;
	let counter = 0;
	cy.get(basePage?._selectors.trgovukTableRow).each(($row)=> {
		const rowtext=$row.text();
		//cy.log('countercheck',counter);
		if(rowtext.includes(lpaQuestionnaireData?.hasAppealType) && !rowtext.includes(lpaQuestionnaireData?.todoInvalid)) {
			if(counter === 1){		
			cy.log(rowtext);
		
			cy.wrap($row).within(() => {
			cy.get(basePage?._selectors.trgovukTableCell).contains(lpaQuestionnaireData?.hasAppealType).should('be.visible');
			//Log all below links for debug
			cy.get('a').each(($link) => {
				if($link.attr('href')?.includes(lpaQuestionnaireData?.todoQuestionnaire)){
					appealId=$link.attr('href')?.split('/').pop();
					cy.log(appealId);
					//cy.log(`Link found:${$link.text()},href:${$link.attr('href')}`);
					cy.wrap($link).scrollIntoView().should('be.visible').click({force: true});
					return false;
				}						
			});			
			});			
		}
		counter++;
		}		
	}).then(() =>{
	
	cy.url().should('include',`/manage-appeals/questionnaire/${appealId}`);
	cy.get(basePage?._selectors.dlgovukSummaryListAppealDetails).within(()=>{
		cy.get(basePage?._selectors.govukSummaryListRow).each(($row)=>{
			const $key = $row.find(basePage?._selectors.govukSummaryListKey);
			if($key.text().trim() === lpaQuestionnaireData?.appealType) {
				cy.wrap($row).find(basePage?._selectors.govukSummaryListValue).should('contain.text', lpaQuestionnaireData?.appealTypeHouseholder);
			return false;
			} 
		});

	});
	cy.contains(lpaQuestionnaireData?.constraintsAndDesignations?.correctTypeOfAppeal).closest(basePage?._selectors.govukSummaryListRow).find(basePage?._selectors.agovukLink).then($link=>{
		if($link.text().includes(lpaQuestionnaireData?.questionnaireAnswer)){
			cy.wrap($link).contains(lpaQuestionnaireData?.questionnaireAnswer).click();
		} else {
			cy.wrap($link).contains(lpaQuestionnaireData?.questionnaireChange).click();
		}
	});
	constraintsAndDesignations.selectCorrectTypeOfAppeal(context);	
	constraintsAndDesignations.selectAffectListedBuildings(context,lpaQuestionnaireData);
	constraintsAndDesignations.selectConservationArea(context);	
	constraintsAndDesignations.selectIsGreenBelt(context);	
	notifyParties.selectAndNotifyParties(context,lpaQuestionnaireData);
	consultResponseAndRepresent.selectOtherPartyRepresentations(context);
	//Planning officer's report and supplementary documents
	poReportAndSupportDocs.selectPOReportAndSupportDocs(context);
	//Site access
	siteAccess.selectLpaSiteAccess(context,lpaQuestionnaireData);	
	siteAccess.selectNeighbourSiteAccess(context,lpaQuestionnaireData);
	siteAccess.selectLpaSiteSafetyRisks(context,lpaQuestionnaireData);	
// Appeals Access
	appealProcess.selectNearbyAppeals(context,lpaQuestionnaireData);	
	appealProcess.selectNewConditionss(context,lpaQuestionnaireData);	
});
// commented for test during codding
// 	cy.getByData(lpaQuestionnaireData?.submitQuestionnaire).click();
// 	cy.get(basePage?._selectors.govukPanelTitle).contains(lpaQuestionnaireData?.questionnaireSubmitted);
 };
