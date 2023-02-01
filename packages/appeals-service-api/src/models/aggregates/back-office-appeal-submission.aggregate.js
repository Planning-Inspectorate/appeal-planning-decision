const BackOfficeSubmissionEntity = require('../entities/back-office-submission-entity');
const AggregateDifference = require('../../value-objects/aggregate-difference-result.value');
const logger = require('../../lib/logger');

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
	 * @param {BackOfficeAppealSubmissionAggregate} otherBackOfficeAppealSubmission
	 * @returns {AggregateDifference} The BackOfficeSubmissionEntity's in the input
	 * whose back office ID differs from the back office IDs in this object.
	 */
	difference(otherBackOfficeAppealSubmission) {
		const mapOfOrganisationsInInput =
			otherBackOfficeAppealSubmission.getOrganisationsAsMapIndexedById();
		const mapOfContactsInInput = otherBackOfficeAppealSubmission.getContactsAsMapIndexedById();
		const mapOfDocumentsInInput = otherBackOfficeAppealSubmission.getDocumentsAsMapIndexedById();

		const result = [];
		result.push(
			this.#getBackOfficeIdEntityDifferences(
				this.#organisationsAsMapIndexedById,
				mapOfOrganisationsInInput
			)
		);
		result.push(
			this.#getBackOfficeIdEntityDifferences(this.#contactsAsMapIndexedById, mapOfContactsInInput)
		);
		result.push(
			this.#getBackOfficeIdEntityDifferences(this.#documentsAsMapIndexedById, mapOfDocumentsInInput)
		);
		if (
			this.#appeal.getBackOfficeId() !== otherBackOfficeAppealSubmission.getAppealBackOfficeId()
		) {
			result.push(otherBackOfficeAppealSubmission.getAppeal());
		}

		return new AggregateDifference(this.getId(), result.flatM);
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
		// let organisationsToUpdateMap = new Map();
		// for (const organisation of organisations) {
		//     organisationsToUpdateMap.set(organisation.getId(), organisation);
		// }

		// let contactsToUpdateMap = new Map();
		// for (const contact of contacts) {
		//     contactsToUpdateMap.set(contact.getId(), contact);
		// }

		// let documentsToUpdateMap = new Map();
		// for (const document of documents) {
		//     documentsToUpdateMap.set(document.getId(), document);
		// }

		const updatedOrganisations = this.#getUpdatesForEntities(
			this.#organisationsAsMapIndexedById,
			organisations
		);
		const updatedContacts = this.#getUpdatesForEntities(this.#contactsAsMapIndexedById, contacts);
		const updatedDocuments = this.#getUpdatesForEntities(
			this.#documentsAsMapIndexedById,
			documents
		);

		// Note that we are not mutating the state of the object this method is called on, this
		// is because state mutation is not preferred! See https://blog.sapegin.me/all/avoid-mutation/
		const updatedAggregate = new BackOfficeAppealSubmissionAggregate(
			this.#id,
			updatedOrganisations,
			updatedContacts,
			appeal,
			updatedDocuments
		);

		logger.debug(updatedAggregate.toJSON(), 'Updated aggregate');
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
		result.appeal = this.#appeal.getBackOfficeId();
		this.#documents.map((doc) => (result.documents[doc.getId()] = doc));
		return result;
	}

	#getUpdatesForEntities(entityMap, updates) {
		const result = [];

		entityMap.forEach((entity, entityId) => {
			let backOfficeId = entity.getBackOfficeId(); // We'll assume there's no change
			if (updates[entityId]) {
				backOfficeId = updates[entityId].getBackOfficeId();
			}

			result.push(new BackOfficeSubmissionEntity(entity.getId(), backOfficeId));
		});
		return result;
	}

	#getBackOfficeIdEntityDifferences(mapOfEntitiesFromThis, mapOfEntitiesFromThat) {
		const result = [];

		mapOfEntitiesFromThat.forEach((value, key) => {
			if (
				mapOfEntitiesFromThis.has(key) &&
				mapOfEntitiesFromThis.get(key).getBackOfficeId() !== value.getBackOfficeId()
			) {
				result.push(value);
			}
		});

		return result;
	}
}

module.exports = BackOfficeAppealSubmissionAggregate;
