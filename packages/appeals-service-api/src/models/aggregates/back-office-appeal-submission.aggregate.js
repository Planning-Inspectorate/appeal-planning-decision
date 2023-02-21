const BackOfficeSubmissionEntity = require('../entities/back-office-submission-entity');

class BackOfficeAppealSubmissionAggregate {
	#id;
	#organisations;
	#contacts;
	#appeal;
	#documents;

	#organisationsAsMapIndexedById = new Map();
	#contactsAsMapIndexedById = new Map();
	#documentsAsMapIndexedById = new Map();

	/**
	 *
	 * @param {BackOfficeSubmissionEntity[]} organisations
	 * @param {BackOfficeSubmissionEntity[]} contacts
	 * @param {BackOfficeSubmissionEntity} appeal
	 * @param {BackOfficeSubmissionEntity[]} documents
	 */
	constructor(id, organisations, contacts, appeal, documents) {
		this.#id = id;
		this.#organisations = organisations;
		this.#contacts = contacts;
		this.#appeal = appeal;
		this.#documents = documents;

		this.#organisations.forEach((organisation) =>
			this.#organisationsAsMapIndexedById.set(organisation.getId(), organisation)
		);
		this.#contacts.forEach((contact) =>
			this.#contactsAsMapIndexedById.set(contact.getId(), contact)
		);
		this.#documents.forEach((document) =>
			this.#documentsAsMapIndexedById.set(document.getId(), document)
		);
	}

	getId() {
		return this.#id;
	}

	getAppealId() {
		return this.#appeal.getId();
	}

	/**
	 *
	 * @returns {string|null}
	 */
	getAppealBackOfficeId() {
		return this.#appeal.getBackOfficeId();
	}

	getAppealFailures() {
		return this.#appeal.getFailures();
	}

	getAppeal() {
		return this.#appeal;
	}

	getOrganisations() {
		return this.#organisations;
	}

	getContacts() {
		return this.#contacts;
	}

	getDocuments() {
		return this.#documents;
	}

	/**
	 *
	 * @returns {BackOfficeSubmissionEntity[]}
	 */
	getOrganisationsPendingSubmission() {
		return this.#organisations.filter((organisationSubmission) =>
			organisationSubmission.isPending()
		);
	}

	/**
	 *
	 * @returns {BackOfficeSubmissionEntity[]}
	 */
	getContactsPendingSubmission() {
		return this.#contacts.filter((contactSubmission) => contactSubmission.isPending());
	}

	/**
	 * @returns {boolean}
	 */
	isAppealDataPendingSubmission() {
		return this.#appeal.isPending();
	}

	/**
	 * @returns {BackOfficeSubmissionEntity[]}
	 */
	getDocumentsPendingSubmission() {
		return this.#documents.filter((documentSubmission) => documentSubmission.isPending());
	}

	/**
	 *
	 * @returns {Map<string, BackOfficeSubmissionEntity>}
	 */
	getOrganisationsAsMapIndexedById() {
		return this.#organisationsAsMapIndexedById;
	}

	/**
	 *
	 * @returns {Map<string, BackOfficeSubmissionEntity>}
	 */
	getContactsAsMapIndexedById() {
		return this.#contactsAsMapIndexedById;
	}

	/**
	 *
	 * @returns {Map<string, BackOfficeSubmissionEntity>}
	 */
	getDocumentsAsMapIndexedById() {
		return this.#documentsAsMapIndexedById;
	}

	/**
	 *
	 * @param {BackOfficeSubmissionEntity[]} organisations
	 * @param {BackOfficeSubmissionEntity[]} contacts
	 * @param {BackOfficeSubmissionEntity} appeal
	 * @param {BackOfficeSubmissionEntity[]} documents
	 * @returns {BackOfficeAppealSubmissionAggregate} A new instance, with the updates applied.
	 */
	update(organisations, contacts, appeal, documents) {
		// Note that we are not mutating the state of the object this method is called on, this
		// is because state mutation is not preferred! See https://blog.sapegin.me/all/avoid-mutation/

		const updatedOrganisations = this.#getUpdatesForEntities(
			this.#organisationsAsMapIndexedById,
			organisations
		);
		const updatedContacts = this.#getUpdatesForEntities(this.#contactsAsMapIndexedById, contacts);
		const updatedDocuments = this.#getUpdatesForEntities(
			this.#documentsAsMapIndexedById,
			documents
		);

		const updatedAggregate = new BackOfficeAppealSubmissionAggregate(
			this.#id,
			updatedOrganisations,
			updatedContacts,
			appeal,
			updatedDocuments
		);

		return updatedAggregate;
	}

	/**
	 * @returns {boolean} Whether the appeal submission to the back-office is complete.
	 * This will only return true if all organisations, contacts, and documents have back
	 * office IDs, and if the core appeal data has a back office ID too.
	 */
	isComplete() {
		return (
			this.#organisations.every((organisation) => organisation.getBackOfficeId()) &&
			this.#contacts.every((contact) => contact.getBackOfficeId()) &&
			this.#appeal.getBackOfficeId() &&
			this.#documents.every((document) => document.getBackOfficeId())
		);
	}
	someEntitiesHaveMaximumFailures() {
		return (
			this.#organisations.some((organisation) => organisation.hasMaximumFailures()) ||
			this.#contacts.some((contact) => contact.hasMaximumFailures()) ||
			this.#appeal.hasMaximumFailures() ||
			this.#documents.some((document) => document.hasMaximumFailures())
		);
	}

	toJSON() {
		const result = {
			id: this.#id,
			organisations: {},
			contacts: {},
			appeal: {},
			documents: {}
		};

		this.#organisations.forEach((org) => (result.organisations[org.getId()] = org));
		this.#contacts.map((contact) => (result.contacts[contact.getId()] = contact));
		result.appeal = this.#appeal;
		this.#documents.map((doc) => (result.documents[doc.getId()] = doc));
		return result;
	}

	#getUpdatesForEntities(entityMap, updates) {
		const result = [];

		entityMap.forEach((entity, entityId) => {
			let backOfficeId = entity.getBackOfficeId(); // We'll assume there's no change
			let failures = entity.getFailures();
			if (updates[entityId]) {
				backOfficeId = updates[entityId].getBackOfficeId();
				failures = updates[entityId].getFailures();
			}

			result.push(new BackOfficeSubmissionEntity(entity.getId(), backOfficeId, failures));
		});
		return result;
	}
}

module.exports = BackOfficeAppealSubmissionAggregate;
