const { VIEW } = require('../../lib/views');
const { apiClient } = require('../../lib/appeals-api-client');
const { formatHeadlineData } = require('@pins/common');
const { determineUser } = require('../../lib/determine-user');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 */

/**
 * @type {Array<{ heading: string, links: Array<{ url: string, text: string, condition: (appealCase: AppealCaseWithAppellant) => boolean }> }>}
 */
const conditionalSections = [
	{
		heading: 'Questionnaire',
		links: [
			{
				url: 'anything',
				text: 'View questionnaire',
				condition: (appealCase) => appealCase.hasQuestionnaire
			},
			{
				url: 'anything',
				text: 'Do something else',
				condition: (appealCase) => appealCase.hasOtherThing
			}
		]
	},
	{
		heading: 'Next thing',
		links: [
			{
				url: 'anything',
				text: 'Do something else',
				condition: (appealCase) => appealCase.hasThis
			}
		]
	},
	{
		heading: 'Last thing',
		links: [
			{
				url: 'anything',
				text: 'Do something else',
				condition: (appealCase) => appealCase.hasThat
			}
		]
	}
];

const fakeAppeal = {
	hasQuestionnaire: true,
	hasOtherThing: false,
	hasThis: false,
	hasThat: true
};

// Shared controller for /appeals/:caseRef and manage-appeals/:caseRef
exports.get = async (req, res) => {
	const appealNumber = req.params.appealNumber;
	const userRouteUrl = req.originalUrl;

	// determine user based on route to selected appeal
	//i.e '/appeals/' = appellant | agent
	const userType = determineUser(userRouteUrl);

	if (userType === null) {
		throw new Error('Unknown role');
	}

	let userEmail;

	if (userType === LPA_USER_ROLE) {
		userEmail = req.session.lpaUser.email;
	} else {
		userEmail = req.session.email;
	}

	if (!userEmail) {
		throw new Error('no session email');
	}

	const user = await apiClient.getUserByEmailV2(userEmail);

	const caseData = await apiClient.getUsersAppealCase({
		caseReference: appealNumber,
		role: userType,
		userId: user.id
	});

	const headlineData = formatHeadlineData(caseData, userType);

	const viewContext = {
		appeal: {
			appealNumber: appealNumber,
			headlineData,
			// placeholder sections info
			sections: conditionalSections.map((section) => ({
				...section,
				links: section.links.filter(({ condition }) => condition(fakeAppeal))
			}))
		}
	};

	res.render(VIEW.SELECTED_APPEAL.APPEAL, viewContext);
};
