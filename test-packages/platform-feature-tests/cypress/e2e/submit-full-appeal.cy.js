import { submitFullAppealTestCases } from "../utils/fullAppeal/submitFullAppealUtil";
const { submitAppealFlow } = require('../support/flows/appeal');

describe('Full Appeal Submit Test cases', () => {

	submitFullAppealTestCases.forEach((context) => {
		const {
			statusOfOriginalApplication,
			typeOfDecisionRequested,
			statusOfPlanningObligation,			
			typeOfPlanningApplication,
			applicationForm
		} = context;
		it(`sends a Full planning application successfully to Horizon where the original application status is "${statusOfOriginalApplication}", 
				the decision type requested is "${typeOfDecisionRequested}", the planning obligation status is "${statusOfPlanningObligation}", application type is 
				${typeOfPlanningApplication} and appellant is ${applicationForm?.isAppellant} application form has area unit ${applicationForm?.areaUnits}  
				and know other land owners ${applicationForm?.knowsOtherOwners ?? applicationForm?.knowsAllOwners} appellant in green belt is ${applicationForm?.appellantInGreenBelt}
				with all own land ${applicationForm?.isOwnsAllLand} and with own some land ${applicationForm?.isOwnsSomeLand} and knows all owners ${applicationForm?.knowsAllOwners}
				and knows other owners ${applicationForm?.knowsOtherOwners} and Agricultural Holding ${applicationForm?.isAgriculturalHolding} with 
				tenant agriculture holding ${applicationForm?.isTenantAgricultureHolding} with any other tenant ${applicationForm?.anyOtherTenants} and 
				inspector need access ${applicationForm?.isInspectorNeedAccess} with  appellant site safety ${applicationForm?.isAppellantSiteSafety} and 
				Update Development Description to ${applicationForm?.iaUpdateDevelopmentDescription} with appellant procedure preference ${applicationForm?.appellantProcedurePreference}
				and any other appeals ${applicationForm?.anyOtherAppeals} with Appellant Linked Case Add ${applicationForm?.isAppellantLinkedCaseAdd}`, () => {
			submitAppealFlow({
				statusOfOriginalApplication,
				typeOfDecisionRequested,
				statusOfPlanningObligation,
				planning: typeOfPlanningApplication,
				context
			});
		});
	});
});
