const getOpenAppeals = (appeals) => {
	const currentDate = new Date();
	return appeals.filter((appeal) => new Date(appeal.interestedPartyRepsDueDate) > currentDate);
};

const getClosedAppeals = (appeals) => {
	const currentDate = new Date();
	return appeals.filter((appeal) => new Date(appeal.interestedPartyRepsDueDate) < currentDate);
};

const sortByInterestedPartyRepsDueDate = (a, b) => {
	return new Date(a.interestedPartyRepsDueDate) - new Date(b.interestedPartyRepsDueDate);
};

const sortByCaseReference = (a, b) => {
	return a.caseReference.localeCompare(b.caseReference, undefined, { numeric: true });
};

const sortByCaseDecisionDate = (a, b) => {
	return new Date(b.caseDecisionDate) - new Date(a.caseDecisionDate);
};

module.exports = {
	getOpenAppeals,
	getClosedAppeals,
	sortByInterestedPartyRepsDueDate,
	sortByCaseReference,
	sortByCaseDecisionDate
};
