const { VIEW } = require('../../../src/lib/views');

describe('lib/views', () => {
	it('should have the expected defined constants', () => {
		expect(VIEW).toEqual({
			APPLICATION_NUMBER: 'application-number',

			COOKIES: 'cookies',
			OUT_OF_TIME_SHUTTER_PAGE: 'full-appeal/out-of-time-shutter-page',

			APPLICATION_SAVED: 'application-saved',
			CANNOT_APPEAL: 'cannot-appeal',
			CONFIRM_EMAIL_ADDRESS: 'confirm-email-address',
			EMAIL_ADDRESS: 'email-address',
			EMAIL_ADDRESS_CONFIRMED: 'email-address-confirmed',
			LIST_OF_DOCUMENTS: 'list-of-documents',
			LINK_EXPIRED: 'link-expired',
			PLANNING_APPLICATION_NUMBER: 'planning-application-number',
			SENT_ANOTHER_LINK: 'sent-another-link',

			BEFORE_YOU_START: {
				FIRST_PAGE: 'before-you-start/first-page',
				USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE:
					'before-you-start/use-existing-service-enforcement-notice',
				USE_EXISTING_SERVICE_DEVELOPMENT_TYPE:
					'before-you-start/use-existing-service-development-type',
				USE_EXISTING_SERVICE_LISTED_BUILDING:
					'before-you-start/use-existing-service-listed-building'
			},

			APPELLANT_SUBMISSION: {
				APPEAL_STATEMENT: 'appellant-submission/appeal-statement',
				APPLICATION_NUMBER: 'appellant-submission/application-number',
				APPLICANT_NAME: 'appellant-submission/applicant-name',
				APPEAL_ALREADY_SUBMITTED: 'appeal-householder-decision/appeal-already-submitted',
				CANNOT_APPEAL: 'appeal-householder-decision/cannot-appeal',
				CONFIRMATION: 'appellant-submission/confirmation',
				CHECK_ANSWERS: 'appellant-submission/check-answers',
				CODE_EXPIRED: 'appeal-householder-decision/code-expired',
				ENTER_CODE: 'appeal-householder-decision/enter-code',
				REQUEST_NEW_CODE: 'appeal-householder-decision/request-new-code',
				SITE_LOCATION: 'appellant-submission/site-location',
				SITE_OWNERSHIP: 'appellant-submission/site-ownership',
				SITE_OWNERSHIP_CERTB: 'appellant-submission/site-ownership-certb',
				SITE_ACCESS_SAFETY: 'appellant-submission/site-access-safety',
				SITE_ACCESS: 'appellant-submission/site-access',
				SUPPORTING_DOCUMENTS: 'appellant-submission/supporting-documents',
				SUBMISSION: 'appellant-submission/submission',
				SUBMISSION_INFORMATION: 'appellant-submission/submission-information',
				TASK_LIST: 'appeal-householder-decision/task-list',
				UPLOAD_APPLICATION: 'appellant-submission/upload-application',
				UPLOAD_DECISION: 'appellant-submission/upload-decision',
				WHO_ARE_YOU: 'appellant-submission/who-are-you',
				YOUR_DETAILS: 'appellant-submission/your-details'
			},

			ELIGIBILITY: {
				APPEAL_STATEMENT: 'eligibility/appeal-statement',
				COSTS: 'eligibility/costs',
				COSTS_OUT: 'eligibility/costs-out',
				DECISION_DATE: 'eligibility/decision-date',
				DECISION_DATE_PASSED: 'eligibility/decision-date-passed',
				ENFORCEMENT_NOTICE: 'eligibility/enforcement-notice',
				ENFORCEMENT_NOTICE_OUT: 'eligibility/enforcement-notice-out',
				GRANTED_REFUSED_PERMISSION: 'eligibility/granted-or-refused-permission',
				GRANTED_REFUSED_PERMISSION_OUT: 'eligibility/granted-or-refused-permission-out',
				HOUSEHOLDER_PLANNING_PERMISSION: 'eligibility/householder-planning-permission',
				HOUSEHOLDER_PLANNING_PERMISSION_OUT: 'eligibility/householder-planning-permission-out',
				LISTED_BUILDING: 'eligibility/listed-building',
				LISTED_OUT: 'eligibility/listed-out',
				NO_DECISION: 'eligibility/no-decision',
				PLANNING_DEPARTMENT: 'eligibility/planning-department',
				PLANNING_DEPARTMENT_OUT: 'eligibility/planning-department-out'
			},

			GUIDANCE_PAGES: {
				AFTER_APPEAL: 'guidance-pages/after-appeal',
				BEFORE_APPEAL: 'guidance-pages/before-appeal',
				START_APPEAL: 'guidance-pages/start-appeal',
				STAGES_APPEAL: 'guidance-pages/stages-appeal',
				WHEN_APPEAL: 'guidance-pages/when-appeal'
			},

			FULL_APPEAL: {
				ADVERTISING_YOUR_APPEAL: 'full-appeal/submit-appeal/advertising-your-appeal',
				AGRICULTURAL_HOLDING: 'full-appeal/submit-appeal/agricultural-holding',
				ANY_OF_FOLLOWING: 'full-appeal/any-of-following',
				APPEAL_SITE_ADDRESS: 'full-appeal/submit-appeal/appeal-site-address',
				APPLICATION_CERTIFICATES_INCLUDED:
					'full-appeal/submit-appeal/application-certificates-included',
				APPLICATION_FORM: 'full-appeal/submit-appeal/application-form',
				APPLICANT_NAME: 'full-appeal/submit-appeal/applicant-name',
				APPEAL_STATEMENT: 'full-appeal/submit-appeal/appeal-statement',
				APPEAL_SUBMITTED: 'full-appeal/submit-appeal/appeal-submitted',
				APPEAL_ALREADY_SUBMITTED: 'full-appeal/submit-appeal/appeal-already-submitted',
				ARE_YOU_A_TENANT: 'full-appeal/submit-appeal/are-you-a-tenant',
				CAN_USE_SERVICE_FULL_APPEAL: 'full-appeal/can-use-service',
				CAN_USE_SERVICE_PRIOR_APPROVAL: 'full-appeal/prior-approval/can-use-service',
				CAN_USE_SERVICE_REMOVAL_OR_VARIATION_OF_CONDITIONS:
					'full-appeal/removal-or-variation-of-conditions/can-use-service',
				CERTIFICATES: 'full-appeal/submit-appeal/certificates',
				CHECK_YOUR_ANSWERS: 'full-appeal/submit-appeal/check-your-answers',
				CONTACT_DETAILS: 'full-appeal/submit-appeal/contact-details',
				CODE_EXPIRED: 'full-appeal/submit-appeal/code-expired',
				DATE_DECISION_DUE: 'full-appeal/date-decision-due',
				DECLARATION: 'full-appeal/submit-appeal/declaration',
				DECLARATION_INFORMATION: 'full-appeal/submit-appeal/declaration-information',
				DECISION_DATE: 'full-appeal/decision-date',
				DECISION_LETTER: 'full-appeal/submit-appeal/decision-letter',
				DESIGN_ACCESS_STATEMENT_SUBMITTED:
					'full-appeal/submit-appeal/design-access-statement-submitted',
				DESIGN_ACCESS_STATEMENT: 'full-appeal/submit-appeal/design-access-statement',
				DRAFT_STATEMENT_COMMON_GROUND: 'full-appeal/submit-appeal/draft-statement-common-ground',
				DRAFT_PLANNING_OBLIGATION: 'full-appeal/submit-appeal/draft-planning-obligation',
				ENFORCEMENT_NOTICE: 'full-appeal/enforcement-notice',
				ENTER_CODE: 'full-appeal/submit-appeal/enter-code',
				EMAIL_CONFIRMED: 'full-appeal/submit-appeal/email-address-confirmed',
				EXPECT_ENQUIRY_LAST: 'full-appeal/submit-appeal/expect-inquiry-last',
				GRANTED_OR_REFUSED: 'full-appeal/granted-or-refused',
				HEALTH_SAFETY_ISSUES: 'full-appeal/submit-appeal/health-safety-issues',
				HOW_DECIDE_APPEAL: 'full-appeal/submit-appeal/how-decide-appeal',
				IDENTIFYING_THE_OWNERS: 'full-appeal/submit-appeal/identifying-the-owners',
				KNOW_THE_OWNERS: 'full-appeal/submit-appeal/know-the-owners',
				LETTER_CONFIRMING_APPLICATION: 'full-appeal/submit-appeal/letter-confirming-application',
				LOCAL_PLANNING_DEPARTMENT: 'full-appeal/local-planning-department',
				NEW_DOCUMENTS: 'full-appeal/submit-appeal/new-documents',
				NEW_PLANS_DRAWINGS: 'full-appeal/submit-appeal/new-plans-drawings',
				OTHER_TENANTS: 'full-appeal/submit-appeal/other-tenants',
				OTHER_SUPPORTING_DOCUMENTS: 'full-appeal/submit-appeal/other-supporting-documents',
				OWN_ALL_THE_LAND: 'full-appeal/submit-appeal/own-all-the-land',
				OWN_SOME_OF_THE_LAND: 'full-appeal/submit-appeal/own-some-of-the-land',
				ORIGINAL_APPLICANT: 'full-appeal/submit-appeal/original-applicant',
				ORIGINAL_DECISION_NOTICE: 'full-appeal/submit-appeal/original-decision-notice',
				PRIOR_APPROVAL_EXISTING_HOME: 'full-appeal/prior-approval-existing-home',
				PLANS_DRAWINGS_DOCUMENTS: 'full-appeal/submit-appeal/plans-drawings-documents',
				PLANS_DRAWINGS: 'full-appeal/submit-appeal/plans-drawings',
				PLANNING_OBLIGATION_PLANNED: 'full-appeal/submit-appeal/planning-obligation-planned',
				PLANNING_OBLIGATION_STATUS: 'full-appeal/submit-appeal/planning-obligation-status',
				PLANNING_OBLIGATION_DOCUMENTS: 'full-appeal/submit-appeal/planning-obligation',
				PLANNING_OBLIGATION_DEADLINE: 'full-appeal/submit-appeal/planning-obligation-deadline',
				PROPOSED_DEVELOPMENT_CHANGED: 'full-appeal/submit-appeal/proposed-development-changed',
				REQUEST_NEW_CODE: 'full-appeal/submit-appeal/request-new-code',
				TASK_LIST: 'full-appeal/submit-appeal/task-list',
				TELLING_THE_LANDOWNERS: 'full-appeal/submit-appeal/telling-the-landowners',
				TELLING_THE_TENANTS: 'full-appeal/submit-appeal/telling-the-tenants',
				TYPE_OF_PLANNING_APPLICATION: 'full-appeal/type-of-planning-application',
				USE_A_DIFFERENT_SERVICE: 'full-appeal/use-a-different-service',
				USE_EXISTING_SERVICE_APPLICATION_TYPE: 'full-appeal/use-existing-service-application-type',
				USE_EXISTING_SERVICE_LOCAL_PLANNING_DEPARTMENT:
					'full-appeal/use-existing-service-local-planning-department',
				VISIBLE_FROM_ROAD: 'full-appeal/submit-appeal/visible-from-road',
				WHY_HEARING: 'full-appeal/submit-appeal/why-hearing',
				WHY_INQUIRY: 'full-appeal/submit-appeal/why-inquiry'
			},

			HOUSEHOLDER_PLANNING: {
				ELIGIBILITY: {
					CAN_USE_SERVICE_HOUSEHOLDER: 'householder-planning/eligibility/can-use-service',
					CAN_USE_SERVICE_PRIOR_APPROVAL:
						'householder-planning/eligibility/prior-approval/can-use-service',
					CAN_USE_SERVICE_REMOVAL_OR_VARIATION_OF_CONDITIONS:
						'householder-planning/eligibility/removal-or-variation-of-conditions/can-use-service',
					CLAIMING_COSTS: 'householder-planning/eligibility/claiming-costs-householder',
					CONDITIONS_HOUSEHOLDER_PERMISSION:
						'householder-planning/eligibility/conditions-householder-permission',
					DATE_DECISION_DUE_HOUSEHOLDER:
						'householder-planning/eligibility/date-decision-due-householder',
					DECISION_DATE_HOUSEHOLDER: 'householder-planning/eligibility/decision-date-householder',
					ENFORCEMENT_NOTICE_HOUSEHOLDER:
						'householder-planning/eligibility/enforcement-notice-householder',
					GRANTED_OR_REFUSED_HOUSEHOLDER:
						'householder-planning/eligibility/granted-or-refused-householder',
					HAS_APPEAL_FORM: 'householder-planning/eligibility/results-householder',
					LISTED_BUILDING_HOUSEHOLDER:
						'householder-planning/eligibility/listed-building-householder',
					LISTED_BUILDING: 'householder-planning/eligibility/listed-building-householder',
					USE_EXISTING_SERVICE_COSTS: 'householder-planning/eligibility/use-existing-service-costs'
				}
			},

			YOUR_PLANNING_APPEAL: {
				INDEX: 'your-planning-appeal/index',
				YOUR_APPEAL_DETAILS: 'your-planning-appeal/your-appeal-details'
			},

			MESSAGES: {
				COOKIES_UPDATED_SUCCESSFULLY: 'messages/cookies-updated-successfully'
			}
		});
	});
});
