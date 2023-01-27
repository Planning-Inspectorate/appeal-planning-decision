const BackOfficeSubmissionEntity = require('../entities/back-office-submission-entity');
const logger = require('../../lib/logger');

class BackOfficeAppealSubmissionAggregate {
    #id;
    #organisations;
    #contacts;
    #appeal;
    #documents;

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

        this.#documents.forEach(document => this.#documentsAsMapIndexedById.set(document.getId(), document));
    }

    getId() {
        return this.#id
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

    getOrganisations(){
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
        return this.#organisations.filter(organisationSubmission => organisationSubmission.isPending());
    }

    /**
     * 
     * @returns {BackOfficeSubmissionEntity[]}
     */
     getContactsPendingSubmission() {
        return this.#organisations.filter(contactSubmission => contactSubmission.isPending());
    }

    /**
     * @returns {boolean}
     */
    isAppealDataPendingSubmission(){
        return this.#appeal.isPending();
    }

    /**
     * @returns {BackOfficeSubmissionEntity[]}
     */
    getDocumentsPendingSubmission() {
        return this.#documents.filter(documentSubmission => documentSubmission.isPending())
    }

    /**
     * @returns {Map}
     */
    getDocumentsAsMapIndexedById() {
        return this.#documentsAsMapIndexedById;
    }

    /**
     * 
     * @param {BackOfficeAppealSubmissionAggregate} otherBackOfficeAppealSubmission
     * @returns {BackOfficeSubmissionEntity[]} The BackOfficeSubmissionEntity's in the input 
     * whose back office ID differs from the back office IDs in this object.
     */
    difference(otherBackOfficeAppealSubmission) { 
        const mapOfDocumentsInInput = otherBackOfficeAppealSubmission.getDocumentsAsMapIndexedById();
        
        const result = [];
        mapOfDocumentsInInput.forEach((value, key) => {
            if(
                this.#documentsAsMapIndexedById.has(key) && 
                this.#documentsAsMapIndexedById.get(key).getBackOfficeId() !== value.getBackOfficeId()
            ) {
                result.push(value)
            }
        })

        logger.debug(result, "Difference between back-office IDs")
        return result;
    }

    /**
     * 
     * @param {BackOfficeSubmissionEntity} appeal
     * @param {BackOfficeSubmissionEntity[]} documents
     * @returns {BackOfficeAppealSubmissionAggregate} A new instance, with the updates applied.
     */
    update(appeal, documents){

        console.log(documents.length);
        let documentsToUpdateMap = new Map();
        for (const document of documents) {
            documentsToUpdateMap.set(document.getId(), document);
        }
        console.log(documentsToUpdateMap)

        const updatedDocuments = [];
        this.#documentsAsMapIndexedById.forEach((document, documentId) => {
            let backOfficeId = document.getBackOfficeId(); // We'll assume there's no change
            if (documentsToUpdateMap.has(documentId)) {
                console.log('\n\n\n\nUPDATING DOCUMENT\n\n\n\n')
                backOfficeId = documentsToUpdateMap.get(documentId).getBackOfficeId();
            }

            updatedDocuments.push(new BackOfficeSubmissionEntity(document.getId(), backOfficeId));
        })

        // Note that we are not mutating the state of the object this method is called on, this
        // is because state mutation is not preferred! See https://blog.sapegin.me/all/avoid-mutation/
        return new BackOfficeAppealSubmissionAggregate(
            this.#id,
            this.#organisations,
            this.#contacts,
            appeal,
            updatedDocuments
        )
    }

    /**
     * @returns {boolean} Whether the appeal submission to the back-office is complete.
     * At the moment, if all documents are submitted, the appeal will be considered complete.
     */
    isComplete() {
        return this.#documents.every(document => document.getBackOfficeId());
    }

    toJSON() {
        return {
            id: this.#id,
            organisations: this.#organisations.map(org => { return { id: org.getId(), back_office_id: org.getBackOfficeId() } }),
            contacts: this.#contacts.map(contact => { return { id: contact.getId(), back_office_id: contact.getBackOfficeId() } }),
            appeal: { id: this.#appeal.getId(), back_office_id: this.#appeal.getBackOfficeId()},
            documents: this.#documents.map(doc => { return { id: doc.getId(), back_office_id: doc.getBackOfficeId() } })
        }
    }
}

module.exports = BackOfficeAppealSubmissionAggregate;