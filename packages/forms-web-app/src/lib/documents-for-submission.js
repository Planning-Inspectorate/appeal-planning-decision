const { APPEAL_ID } = require('@pins/business-rules/src/constants');

const generateRequiredDocuments = (appealType) => {
	switch (appealType) {
		case APPEAL_ID.HOUSEHOLDER:
			return;
		case APPEAL_ID.PLANNING_SECTION_78:
		case APPEAL_ID.PLANNING_LISTED_BUILDING:
			return [
				'planning application form',
				'plans, drawings and supporting documents for your application',
				'new plans or drawings to support your appeal',
				'other documents to support your appeal'
			];
		case APPEAL_ID.MINOR_COMMERCIAL:
			return [
				'planning application form',
				'plans, drawings and supporting documents for your application'
			];
		case APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT:
		case APPEAL_ID.ADVERTISEMENT:
			return [
				'application form',
				'plans, drawings and supporting documents for your application',
				'decision letter from the local planning authority',
				'any other relevant correspondence with the local authority'
			];
		case APPEAL_ID.ENFORCEMENT_NOTICE:
			return ['enforcement notice', 'enforcement notice plan'];
	}
};

const generateOptionalDocuments = (appealType) => {
	switch (appealType) {
		case APPEAL_ID.HOUSEHOLDER:
			return [
				'decision letter from the local planning authority',
				'appeal statement (including the reason for your appeal and the reasons why you think the local planning authority’s decision is wrong)'
			];
		case APPEAL_ID.PLANNING_SECTION_78:
			return [
				'decision letter from the local planning authority',
				'planning obligation',
				'separate ownership certificate and agricultural land declaration',
				'draft statement of common ground',
				'design and access statement',
				'appeal statement (including the reason for your appeal and the reasons why you think the local planning authority’s decision is wrong)'
			];
		case APPEAL_ID.PLANNING_LISTED_BUILDING:
			return [
				'decision letter from the local planning authority',
				'planning obligation',
				'separate ownership certificate and agricultural land declaration',
				'draft statement of common ground',
				'design and access statement',
				'appeal statement (including the reason for your appeal and the reasons why you think the local planning authority’s decision is wrong)'
			];
		case APPEAL_ID.MINOR_COMMERCIAL:
			return [
				'decision letter from the local planning authority',
				'design and access statement',
				'appeal statement (including the reason for your appeal and the reasons why you think the local planning authority’s decision is wrong)'
			];
		case APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT:
		case APPEAL_ID.ADVERTISEMENT:
			return;
		case APPEAL_ID.ENFORCEMENT_NOTICE:
			return [
				'documents that support your grounds and facts',
				'planning obligation',
				'draft statement of common ground',
				'appeal costs application'
			];
	}
};

module.exports = {
	generateRequiredDocuments,
	generateOptionalDocuments
};
