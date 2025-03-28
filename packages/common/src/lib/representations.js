const { APPEAL_REPRESENTATION_STATUS, SERVICE_USER_TYPE } = require('pins-data-model');

/**
 * @typedef {import('appeals-service-api').Api.Representation} Representation
 * @typedef {import('@pins/common/src/constants').LpaUserRole|import('@pins/common/src/constants').AppealToUserRoles} Submitter
 * @typedef {object} options
 * @property {import('pins-data-model').Schemas.AppealRepresentation['representationType']} options.type
 * @property {boolean} [options.owned]
 * @property {Submitter} [options.submitter]
 */

/**
 * @param {Representation} rep
 * @param {Submitter} [submitter]
 * @returns {boolean}
 */
const isSubmitter = (rep, submitter) => {
	if (!submitter) return true;

	// appellant and agent treated as the same
	if (submitter === SERVICE_USER_TYPE.APPELLANT || submitter === SERVICE_USER_TYPE.AGENT)
		return (
			rep.submittingPartyType === SERVICE_USER_TYPE.APPELLANT ||
			rep.submittingPartyType === SERVICE_USER_TYPE.AGENT
		);

	return rep.submittingPartyType === submitter;
};

/**
 * Find other user's representations by type, must be published
 * @param {Representation} rep
 * @param {options} options
 * @returns {boolean|undefined}
 */
const filterRepresentations = (rep, { type, owned, submitter }) =>
	(!owned || rep.userOwnsRepresentation) &&
	rep.representationType === type &&
	isSubmitter(rep, submitter);

/**
 * Find other user's representations by type, must be published
 * @param {Representation[]|undefined} representations
 * @param {options} options
 * @returns {boolean}
 */
exports.representationExists = (representations, options) => {
	return !!representations?.some((rep) => filterRepresentations(rep, options));
};

/**
 * Find other user's representations by type, must be published
 * @param {Representation[]|undefined} representations
 * @param {options} options
 * @returns {boolean}
 */
exports.representationPublished = (representations, options) => {
	return !!representations?.some(
		(rep) =>
			rep.representationStatus === APPEAL_REPRESENTATION_STATUS.PUBLISHED &&
			filterRepresentations(rep, options)
	);
};

/**
 * Return the received date for a specified representation type
 * @param {Representation[]|undefined} representations
 * @param {options} options
 * @returns {Date|string|undefined}
 */
exports.getRepresentationSubmissionDate = (representations, options) => {
	const filteredRepresentations = representations?.filter((rep) =>
		filterRepresentations(rep, options)
	);

	return !filteredRepresentations || filteredRepresentations.length < 1
		? undefined
		: filteredRepresentations[0].dateReceived;
};
