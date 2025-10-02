const appeal = {
	id: 'fc7cb757-fe21-46dd-b3fd-121c385cd884',
	horizonId: 'HORIZON123',
	lpaCode: 'E69999999',
	decisionDate: new Date(),
	createdAt: new Date(),
	updatedAt: new Date(),
	submissionDate: new Date(),
	state: 'DRAFT',
	appealType: '1001',
	typeOfPlanningApplication: 'householder-planning',
	planningApplicationNumber: '12345',
	email: 'test@example.com',
	hideFromDashboard: true,
	eligibility: {
		applicationDecision: 'granted',
		enforcementNotice: false,
		householderPlanningPermission: true,
		isClaimingCosts: false,
		isListedBuilding: false,
		hasPriorApprovalForExistingHome: true,
		hasHouseholderPermissionConditions: true
	},
	aboutYouSection: {
		yourDetails: {
			isOriginalApplicant: true,
			name: 'Appellant Name',
			appealingOnBehalfOf: ''
		}
	},
	requiredDocumentsSection: {
		originalApplication: {
			uploadedFile: {
				name: 'test-pdf.pdf',
				id: '0722e9b1-209d-478e-bef0-5b3245e1283c',
				originalFileName: 'test-pdf.pdf',
				fileName: 'test-pdf.pdf',
				location: '8c39f736752340b32341caf3bf23450c',
				size: 8334
			}
		},
		decisionLetter: {
			uploadedFile: {
				name: 'test-pdf.pdf',
				id: 'c68d5845-c7f7-4dc7-90a9-4865e241106c',
				originalFileName: 'test-pdf.pdf',
				fileName: 'test-pdf.pdf',
				location: 'd1e3e74a8da03cf7592174a031e85ef0',
				size: 8334
			}
		}
	},
	yourAppealSection: {
		appealStatement: {
			uploadedFile: {
				name: 'test-pdf.pdf',
				id: '390bdb59-6e14-4916-839e-c33aded39526',
				originalFileName: 'test-pdf.pdf',
				fileName: 'test-pdf.pdf',
				location: '23cb607c2723733807fb56ec4efc0236',
				size: 8334
			},
			hasSensitiveInformation: false
		},
		otherDocuments: {
			uploadedFiles: [
				{
					id: '56e471a4-44a2-4f80-aca4-59ce20c25c8a',
					name: 'test-pdf.pdf',
					originalFileName: 'test-pdf.pdf',
					fileName: 'test-pdf.pdf',
					location: '23cb607c2723733807fb56ec4efc0236',
					size: 8334
				},
				{
					id: 'ea651ed4-fa76-46c2-a404-2ea66bd3d0b4',
					name: 'test-pdf.pdf',
					originalFileName: 'test-pdf.pdf',
					fileName: 'test-pdf.pdf',
					location: '23cb607c2723733807fb56ec4efc0236',
					size: 8334
				}
			]
		}
	},
	appealSiteSection: {
		siteAddress: {
			addressLine1: 'Site Address 1',
			addressLine2: 'Site Address 2',
			town: 'Site Town',
			county: 'Site County',
			postcode: 'SW1 1AA'
		},
		siteOwnership: {
			ownsWholeSite: false,
			haveOtherOwnersBeenTold: true
		},
		siteAccess: {
			canInspectorSeeWholeSiteFromPublicRoad: false,
			howIsSiteAccessRestricted: 'A very restricted site'
		},
		healthAndSafety: {
			hasIssues: true,
			healthAndSafetyIssues: 'A very dangerous site'
		}
	},
	appealSubmission: {
		appealPDFStatement: {
			uploadedFile: {
				name: 'Appeal-form.pdf',
				id: '01739574-e34c-4da0-8163-17e55268af7c',
				originalFileName: 'Appeal-form.pdf',
				fileName: 'Appeal-form.pdf',
				location: 'f8adeda29ecc373097a06d1cc98e4e41',
				size: 74375
			}
		}
	},
	sectionStates: {
		aboutYouSection: {
			yourDetails: 'COMPLETED'
		},
		requiredDocumentsSection: {
			originalApplication: 'COMPLETED',
			decisionLetter: 'COMPLETED'
		},
		yourAppealSection: {
			appealStatement: 'COMPLETED',
			otherDocuments: 'COMPLETED'
		},
		appealSiteSection: {
			siteAddress: 'COMPLETED',
			siteAccess: 'COMPLETED',
			siteOwnership: 'COMPLETED',
			healthAndSafety: 'COMPLETED'
		}
	}
};

module.exports = appeal;
