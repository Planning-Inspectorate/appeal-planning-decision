const VIEW = {
	APPLICATION_NUMBER: 'application-number',

	COOKIES: 'cookies',
	YOU_CANNOT_APPEAL: 'full-appeal/you-cannot-appeal',

	BEFORE_YOU_START: {
		FIRST_PAGE: 'before-you-start/first-page',
		LOCAL_PLANNING: 'before-you-start/local-planning-department',
		USE_EXISTING_SERVICE_ENFORCEMENT_NOTICE:
			'before-you-start/use-existing-service-enforcement-notice',

		USE_EXISTING_SERVICE_DEVELOPMENT_TYPE: 'before-you-start/use-existing-service-development-type',
		USE_EXISTING_SERVICE_LISTED_BUILDING: 'before-you-start/use-existing-service-listed-building'
	},

	APPELLANT_SUBMISSION: {
		TASK_LIST: 'appeal-householder-decision/task-list',
		APPEAL_STATEMENT: 'appellant-submission/appeal-statement',
		SITE_LOCATION: 'appellant-submission/site-location',
		SITE_OWNERSHIP: 'appellant-submission/site-ownership',
		SITE_OWNERSHIP_CERTB: 'appellant-submission/site-ownership-certb',
		SUPPORTING_DOCUMENTS: 'appellant-submission/supporting-documents',
		SITE_ACCESS: 'appellant-submission/site-access',
		SITE_ACCESS_SAFETY: 'appellant-submission/site-access-safety',
		YOUR_DETAILS: 'appellant-submission/your-details',
		WHO_ARE_YOU: 'appellant-submission/who-are-you',
		APPLICANT_NAME: 'appellant-submission/applicant-name',
		UPLOAD_APPLICATION: 'appellant-submission/upload-application',
		UPLOAD_DECISION: 'appellant-submission/upload-decision',
		CHECK_ANSWERS: 'appellant-submission/check-answers',
		SUBMISSION: 'appellant-submission/submission',
		CONFIRMATION: 'appellant-submission/confirmation',
		SUBMISSION_INFORMATION: 'appellant-submission/submission-information',
		APPEAL_ALREADY_SUBMITTED: 'appeal-householder-decision/appeal-already-submitted',
		CANNOT_APPEAL: 'appeal-householder-decision/cannot-appeal',
		ENTER_CODE: 'appeal-householder-decision/enter-code',
		REQUEST_NEW_CODE: 'appeal-householder-decision/request-new-code',
		CODE_EXPIRED: 'appeal-householder-decision/code-expired',
		NEED_NEW_CODE: 'appeal-householder-decision/need-new-code',
		EMAIL_CONFIRMED: 'appeal-householder-decision/email-address-confirmed',
		EMAIL_ADDRESS: 'appeal-householder-decision/email-address'
	},

	HOUSEHOLDER_PLANNING: {
		ELIGIBILITY: {
			CLAIMING_COSTS: 'householder-planning/eligibility/claiming-costs-householder',
			USE_EXISTING_SERVICE_COSTS: 'householder-planning/eligibility/use-existing-service-costs',
			DATE_DECISION_DUE_HOUSEHOLDER:
				'householder-planning/eligibility/date-decision-due-householder',
			LISTED_BUILDING_HOUSEHOLDER: 'householder-planning/eligibility/listed-building-householder',
			ENFORCEMENT_NOTICE_HOUSEHOLDER:
				'householder-planning/eligibility/enforcement-notice-householder',
			GRANTED_OR_REFUSED_HOUSEHOLDER:
				'householder-planning/eligibility/granted-or-refused-householder',
			HAS_APPEAL_FORM: 'householder-planning/eligibility/results-householder',
			DECISION_DATE_HOUSEHOLDER: 'householder-planning/eligibility/decision-date-householder',
			LISTED_BUILDING: 'householder-planning/eligibility/listed-building-householder',
			CONDITIONS_HOUSEHOLDER_PERMISSION:
				'householder-planning/eligibility/conditions-householder-permission',
			CAN_USE_SERVICE_HOUSEHOLDER: 'householder-planning/eligibility/can-use-service',
			CAN_USE_SERVICE_PRIOR_APPROVAL:
				'householder-planning/eligibility/prior-approval/can-use-service',
			CAN_USE_SERVICE_REMOVAL_OR_VARIATION_OF_CONDITIONS:
				'householder-planning/eligibility/removal-or-variation-of-conditions/can-use-service'
		}
	},

	FULL_APPEAL: {
		EMAIL_ADDRESS: 'full-appeal/submit-appeal/email-address',
		EMAIL_CONFIRMED: 'full-appeal/submit-appeal/email-address-confirmed',
		ENTER_CODE: 'full-appeal/submit-appeal/enter-code',
		REQUEST_NEW_CODE: 'full-appeal/submit-appeal/request-new-code',
		CODE_EXPIRED: 'full-appeal/submit-appeal/code-expired',
		NEED_NEW_CODE: 'full-appeal/submit-appeal/need-new-code',
		ADVERTISING_YOUR_APPEAL: 'full-appeal/submit-appeal/advertising-your-appeal',
		ANY_OF_FOLLOWING: 'full-appeal/any-of-following',
		AGRICULTURAL_HOLDING: 'full-appeal/submit-appeal/agricultural-holding',
		APPLICANT_NAME: 'full-appeal/submit-appeal/applicant-name',
		APPEAL_STATEMENT: 'full-appeal/submit-appeal/appeal-statement',
		APPLICATION_CERTIFICATES_INCLUDED:
			'full-appeal/submit-appeal/application-certificates-included',
		APPEAL_SUBMITTED: 'full-appeal/submit-appeal/appeal-submitted',
		APPEAL_ALREADY_SUBMITTED: 'full-appeal/submit-appeal/appeal-already-submitted',
		APPEAL_SITE_ADDRESS: 'full-appeal/submit-appeal/appeal-site-address',
		APPLICATION_FORM: 'full-appeal/submit-appeal/application-form',
		ARE_YOU_A_TENANT: 'full-appeal/submit-appeal/are-you-a-tenant',
		CANNOT_APPEAL: 'full-appeal/submit-appeal/cannot-appeal',
		CAN_USE_SERVICE_FULL_APPEAL: 'full-appeal/can-use-service',
		CAN_USE_SERVICE_PRIOR_APPROVAL: 'full-appeal/prior-approval/can-use-service',
		CAN_USE_SERVICE_REMOVAL_OR_VARIATION_OF_CONDITIONS:
			'full-appeal/removal-or-variation-of-conditions/can-use-service',
		CERTIFICATES: 'full-appeal/submit-appeal/certificates',
		CONTACT_DETAILS: 'full-appeal/submit-appeal/contact-details',
		CHECK_YOUR_ANSWERS: 'full-appeal/submit-appeal/check-your-answers',
		DATE_DECISION_DUE: 'full-appeal/date-decision-due',
		DESIGN_ACCESS_STATEMENT: 'full-appeal/submit-appeal/design-access-statement',
		DESIGN_ACCESS_STATEMENT_SUBMITTED:
			'full-appeal/submit-appeal/design-access-statement-submitted',
		DECISION_LETTER: 'full-appeal/submit-appeal/decision-letter',
		DECISION_DATE: 'full-appeal/decision-date',
		DECLARATION: 'full-appeal/submit-appeal/declaration',
		DECLARATION_INFORMATION: 'full-appeal/submit-appeal/declaration-information',
		DRAFT_PLANNING_OBLIGATION: 'full-appeal/submit-appeal/draft-planning-obligation',
		DRAFT_STATEMENT_COMMON_GROUND: 'full-appeal/submit-appeal/draft-statement-common-ground',
		ENFORCEMENT_NOTICE: 'full-appeal/enforcement-notice',
		EXPECT_ENQUIRY_LAST: 'full-appeal/submit-appeal/expect-inquiry-last',
		GRANTED_OR_REFUSED: 'full-appeal/granted-or-refused',
		HEALTH_SAFETY_ISSUES: 'full-appeal/submit-appeal/health-safety-issues',
		HOW_DECIDE_APPEAL: 'full-appeal/submit-appeal/how-decide-appeal',
		IDENTIFYING_THE_OWNERS: 'full-appeal/submit-appeal/identifying-the-owners',
		KNOW_THE_OWNERS: 'full-appeal/submit-appeal/know-the-owners',
		LETTER_CONFIRMING_APPLICATION: 'full-appeal/submit-appeal/letter-confirming-application',
		LIST_OF_DOCUMENTS: 'full-appeal/submit-appeal/list-of-documents',
		LOCAL_PLANNING_DEPARTMENT: 'full-appeal/local-planning-department',
		NEW_PLANS_DRAWINGS: 'full-appeal/submit-appeal/new-plans-drawings',
		NEW_DOCUMENTS: 'full-appeal/submit-appeal/new-documents',
		ORIGINAL_DECISION_NOTICE: 'full-appeal/submit-appeal/original-decision-notice',
		OTHER_TENANTS: 'full-appeal/submit-appeal/other-tenants',
		OWN_ALL_THE_LAND: 'full-appeal/submit-appeal/own-all-the-land',
		OTHER_SUPPORTING_DOCUMENTS: 'full-appeal/submit-appeal/other-supporting-documents',
		ORIGINAL_APPLICANT: 'full-appeal/submit-appeal/original-applicant',
		OWN_SOME_OF_THE_LAND: 'full-appeal/submit-appeal/own-some-of-the-land',
		PROPOSED_DEVELOPMENT_CHANGED: 'full-appeal/submit-appeal/proposed-development-changed',
		PRIOR_APPROVAL_EXISTING_HOME: 'full-appeal/prior-approval-existing-home',
		PLANS_DRAWINGS: 'full-appeal/submit-appeal/plans-drawings',
		PLANNING_OBLIGATION_PLANNED: 'full-appeal/submit-appeal/planning-obligation-planned',
		PLANNING_OBLIGATION_STATUS: 'full-appeal/submit-appeal/planning-obligation-status',
		PLANNING_OBLIGATION: 'full-appeal/submit-appeal/planning-obligation',
		PLANNING_OBLIGATION_DEADLINE: 'full-appeal/submit-appeal/planning-obligation-deadline',
		PLANS_DRAWINGS_DOCUMENTS: 'full-appeal/submit-appeal/plans-drawings-documents',
		PLANNING_APPLICATION_NUMBER: 'full-appeal/submit-appeal/planning-application-number',
		TASK_LIST: 'full-appeal/submit-appeal/task-list',
		TELLING_THE_LANDOWNERS: 'full-appeal/submit-appeal/telling-the-landowners',
		TELLING_THE_TENANTS: 'full-appeal/submit-appeal/telling-the-tenants',
		TYPE_OF_PLANNING_APPLICATION: 'full-appeal/type-of-planning-application',
		USE_A_DIFFERENT_SERVICE: 'full-appeal/use-a-different-service',
		USE_EXISTING_SERVICE_APPLICATION_TYPE: 'full-appeal/use-existing-service-application-type',
		VISIBLE_FROM_ROAD: 'full-appeal/submit-appeal/visible-from-road',
		WHY_HEARING: 'full-appeal/submit-appeal/why-hearing',
		WHY_INQUIRY: 'full-appeal/submit-appeal/why-inquiry',
		YOU_CANNOT_APPEAL: 'full-appeal/you-cannot-appeal'
	},

	APPEAL: {
		NEW_OR_SAVED_APPEAL: 'appeal/new-or-saved-appeal',
		EMAIL_ADDRESS: 'appeal/email-address',
		ENTER_CODE: 'appeal/enter-code',
		REQUEST_NEW_CODE: 'appeal/request-new-code',
		CODE_EXPIRED: 'appeal/code-expired',
		NEED_NEW_CODE: 'appeal/need-new-code',
		START_NEW: 'appeal/start-new' // redirect only
	},

	COMMON: {
		ENTER_CODE: 'common/enter-code',
		REQUEST_NEW_CODE: 'common/request-new-code',
		CODE_EXPIRED: 'common/code-expired',
		NEED_NEW_CODE: 'common/need-new-code'
	},

	APPEALS: {
		YOUR_APPEALS: 'appeals/your-appeals',
		NO_APPEALS: 'appeals/no-appeals'
	},

	YOUR_APPEALS: {
		DECIDED_APPEALS: 'appeals/your-appeals/decided-appeals'
	},

	SELECTED_APPEAL: {
		APPEAL_OVERVIEW: '/appeals',
		APPEAL: 'selected-appeal/appeal',
		APPEAL_DETAILS: 'selected-appeal/appeal-details',
		APPEAL_QUESTIONNAIRE: 'selected-appeal/questionnaire-details',
		APPEAL_FINAL_COMMENTS: 'selected-appeal/final-comments-details',
		APPEAL_IP_COMMENTS: 'selected-appeal/ip-comment-details',
		APPEAL_STATEMENTS: 'selected-appeal/statements',
		APPEAL_PLANNING_OBLIGATION: 'selected-appeal/planning-obligation',
		APPEAL_REPRESENTATIONS: 'selected-appeal/representations'
	},

	SUBMIT_APPEAL: {
		APPLICATION_SAVED: 'submit-appeal/application-saved',
		ENTER_APPEAL_DETAILS: 'submit-appeal/enter-appeal-details'
	},

	LPA_DASHBOARD: {
		ENTER_CODE: 'manage-appeals/enter-code',
		CODE_EXPIRED: 'manage-appeals/code-expired',
		NEED_NEW_CODE: 'manage-appeals/need-new-code',
		REQUEST_NEW_CODE: 'manage-appeals/request-new-code',
		DASHBOARD: 'manage-appeals/your-appeals',
		ADD_REMOVE_USERS: 'manage-appeals/add-remove-users',
		EMAIL_ADDRESS: 'manage-appeals/email-address',
		CONFIRM_ADD_USER: 'manage-appeals/confirm-add-user',
		CONFIRM_REMOVE_USER: 'manage-appeals/confirm-remove-user',
		YOUR_EMAIL_ADDRESS: 'manage-appeals/your-email-address',
		DECIDED_APPEALS: 'manage-appeals/decided-appeals',
		APPEAL_OVERVIEW: '/manage-appeals'
	},

	INTERESTED_PARTY_COMMENTS: {
		ENTER_APPEAL_REFERENCE: 'comment-planning-appeal/enter-appeal-reference'
	},

	RULE_6: {
		EMAIL_ADDRESS: 'rule-6/email-address',
		ENTER_CODE: 'rule-6/enter-code',
		CODE_EXPIRED: 'rule-6/code-expired',
		NEED_NEW_CODE: 'rule-6/need-new-code',
		REQUEST_NEW_CODE: 'rule-6/request-new-code',
		DASHBOARD: 'rule-6/your-appeals',
		DECIDED_APPEALS: 'rule-6/decided-appeals',
		APPEAL_OVERVIEW: '/rule-6'
	},

	MESSAGES: {
		COOKIES_UPDATED_SUCCESSFULLY: 'messages/cookies-updated-successfully'
	},

	ACCESSIBILITY_STATEMENT: 'accessibility-statement/accessibility-statement',

	ERROR_PAGES: {
		SERVICE_UNAVAILABLE: 'error/service-unavailable',
		UNAUTHORIZED: 'error/401',
		FIREWALL_ERROR: 'error/firewall-error'
	}
};

module.exports = {
	VIEW
};
