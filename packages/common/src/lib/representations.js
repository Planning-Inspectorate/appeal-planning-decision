const { APPEAL_REPRESENTATION_STATUS, SERVICE_USER_TYPE } = require('pins-data-model');

/**
 * @typedef {import('appeals-service-api').Api.Representation} Representation
 */

/**
 * @param {Representation[]|undefined} representations
 * @param {string} type
 * @param {boolean} owned
 * @returns {boolean}
 */
exports.representationExists = (representations, type, owned) => {
	return !!representations?.filter(
		(rep) => (!owned || rep.userOwnsRepresentation) && rep.representationType === type
	).length;
};

/**
 * Find other user's representations by type, must be published
 * @param {Representation[]|undefined} representations
 * @param {string} type
 * @param {import('@pins/common/src/constants').LpaUserRole|import('@pins/common/src/constants').AppealToUserRoles} [submitter]
 * @returns {boolean}
 */
exports.representationPublished = (representations, type, submitter) => {
	/**
	 * @param {Representation} rep
	 * @returns {boolean}
	 */
	const isSubmitter = (rep) => {
		if (!submitter) return true;

		// appellant and agent treated as the same
		if (submitter === SERVICE_USER_TYPE.APPELLANT || submitter === SERVICE_USER_TYPE.AGENT)
			return (
				rep.submittingPartyType === SERVICE_USER_TYPE.APPELLANT ||
				rep.submittingPartyType === SERVICE_USER_TYPE.AGENT
			);

		return rep.submittingPartyType === submitter;
	};

	return !!representations?.filter(
		(rep) =>
			rep.representationStatus === APPEAL_REPRESENTATION_STATUS.PUBLISHED && // published
			!rep.userOwnsRepresentation && // not owned
			rep.representationType === type && // matches type
			isSubmitter(rep)
	).length; // if present checks the submittingPartyType matches
};
