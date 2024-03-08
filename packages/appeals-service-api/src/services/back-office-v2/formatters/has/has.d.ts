export interface Submission {
	addAffectedListedBuilding: boolean | null;
	addNearbyAppeal: boolean | null;
	addNeighbouringSiteAccess: boolean | null;
	affectedListedBuildingNumber: number | null;
	affectsListedBuilding: boolean | null;
	conservationArea: boolean | null;
	correctAppealType: boolean | null;
	greenBelt: boolean | null;
	lpaSiteAccess: boolean | null;
	lpaSiteAccessDetails: string | null;
	lpaSiteSafety: boolean | null;
	lpaSiteSafetyDetails: string | null;
	lpaStatement: string | null;
	lpaStatementDocuments: boolean | null;
	nearbyAppealReference: string | null;
	nearbyAppeals: boolean | null;
	'neighbouring-address': {
		county: string | null;
		line1: string | null;
		line2: string | null;
		postcode: string | null;
		town: string | null;
	}[];
	neighbouringSiteAccess: boolean | null;
	neighbouringSiteAccessDetails: string | null;
	newConditionDetails: string | null;
	newConditions: boolean | null;
	notificationMethod: string[] | null;
	otherPartyRepresentations: boolean | null;
}
