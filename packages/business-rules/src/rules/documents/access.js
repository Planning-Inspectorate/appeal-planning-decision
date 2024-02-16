const virusCheckStatuses = {
	checked: 'checked',
	not_checked: 'not_checked',
	failed_virus_check: 'failed_virus_check'
};
const publiclyAvailableTypes = ['a doc type available to all at all times'];
const clientAllowList = new Map([['clientid', ['doctypes always available to client']]]);

// todo: define these
const appellantRole = 'appellant';
const lpaRole = 'lpa';
const interestedPartyRole = 'interestedparty';

/**
 * @typedef {import('../../../../appeals-service-api/index').Schema.Document} DocMetaData
 * @typedef {function(DocMetaData): boolean} PermissionsCheck
 * @type {Object<string, Object<string, PermissionsCheck>>}
 */
const docTypeUserMapping = {
	docTypeExample: {
		[appellantRole]: (md) => {
			return md.stage === 'allowed stage';
		},
		[lpaRole]: () => {
			return false;
		},
		[interestedPartyRole]: () => {
			return true;
		}
	}
};

/**
 * @typedef {Object} params
 * @property {DocMetaData} docMetaData - type of the document
 * @property {string} [client] - client id - server the request originated from
 * @property {'appellant'|'lpa'|'interestedparty'} [role] - information about the user, to be fleshed out
 * @param {params} param
 */
const canAccessBODocument = ({ docMetaData, client, role }) => {
	// always required to show a back office doc
	if (
		docMetaData.virusCheckStatus !== virusCheckStatuses.checked &&
		docMetaData.published &&
		docMetaData.redacted
	) {
		return false;
	}

	// publicly available docs
	if (publiclyAvailableTypes.includes(docMetaData.documentType)) {
		return true;
	}

	// client specific docs
	const allowedByClient = clientAllowList.get(client);
	if (allowedByClient && allowedByClient.includes(docMetaData.documentType)) {
		return true;
	}

	// attempt user mapping check
	try {
		return docTypeUserMapping[docMetaData.documentType][role](docMetaData);
	} catch {
		// todo: log failure
		return false;
	}
};

module.exports = { canAccessBODocument };
