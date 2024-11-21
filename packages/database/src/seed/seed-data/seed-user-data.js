// const { pickRandom, datesNMonthsAgo, datesNMonthsAhead, getFutureDate } = require('./util');
// const { lpaAppealCaseData, lpaAppeals } = require('./lpa-appeal-case-data-dev');
// const { appealDocuments } = require('./appeal-documents-dev');
// const {
// 	APPEAL_CASE_DECISION_OUTCOME,
// 	APPEAL_CASE_PROCEDURE,
// 	APPEAL_CASE_STATUS,
// 	APPEAL_CASE_VALIDATION_OUTCOME
// } = require('pins-data-model');
// const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
// const { CASE_RELATION_TYPES } = require('@pins/common/src/database/data-static');
// const config = require('../configuration/config.js');

// some data here so we can reference in multiple places
// IDs have no specific meaning, just valid UUIDs and used for upsert/relations

const appellants = {
	appellantOne: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a11',
		email: 'appellant1@planninginspectorate.gov.uk',
		serviceUserId: '123475'
	},
	appellantTwo: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a12',
		email: 'appellant2@planninginspectorate.gov.uk'
	},
	appellantThree: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a13',
		email: 'appellant3@planninginspectorate.gov.uk'
	},
	appellantFour: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a14',
		email: 'appellant4@planninginspectorate.gov.uk'
	},
	appellantFive: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a15',
		email: 'appellant5@planninginspectorate.gov.uk'
	},
	appellantSix: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a16',
		email: 'appellant6@planninginspectorate.gov.uk'
	},
	appellantSeven: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a17',
		email: 'appellant7@planninginspectorate.gov.uk'
	},
	appellantEight: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91a18',
		email: 'appellant8@planninginspectorate.gov.uk'
	}
};

const rule6Parties = {
	r6One: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b11',
		email: 'r6-1@planninginspectorate.gov.uk'
	},
	r6Two: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b12',
		email: 'r6-2@planninginspectorate.gov.uk'
	},
	r6Three: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b13',
		email: 'r6-3@planninginspectorate.gov.uk'
	},
	r6Four: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b14',
		email: 'r6-4@planninginspectorate.gov.uk'
	},
	r6Five: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b15',
		email: 'r6-5@planninginspectorate.gov.uk'
	},
	r6Six: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b16',
		email: 'r6-6@planninginspectorate.gov.uk'
	},
	r6Seven: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b17',
		email: 'r6-7@planninginspectorate.gov.uk'
	},
	r6Eight: {
		id: '29670d0f-c4b4-4047-8ee0-d62b93e91b18',
		email: 'r6-8@planninginspectorate.gov.uk'
	}
};

const lpaUsers = {
	lpaUser: {
		id: '248c46a4-400a-4128-9ea9-fc35c2420b9e',
		email: 'user1@planninginspectorate.gov.uk',
		isLpaUser: true,
		isLpaAdmin: false,
		lpaCode: 'Q9999',
		lpaStatus: 'added'
	},
	lpaUser2: {
		id: '795ac593-4fe9-478c-8434-457db576a733',
		email: 'user2@planninginspectorate.gov.uk',
		isLpaUser: true,
		isLpaAdmin: false,
		lpaCode: 'Q1111',
		lpaStatus: 'added'
	},
	lpaAdmin: {
		id: '3e0b7bc5-c91a-456c-b36d-260b2a52aa70',
		email: 'admin1@planninginspectorate.gov.uk',
		isLpaUser: true,
		isLpaAdmin: true,
		lpaCode: 'Q9999',
		lpaStatus: 'confirmed'
	}
};

module.exports = {
	appellants,
	lpaUsers,
	rule6Parties
};
