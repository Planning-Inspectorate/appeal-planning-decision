class BackOfficeAppealSubmissionAggregate {
    #organisations;
    #contacts;
    #appeal;
    #documents;

    /**
     * 
     * @param {BackOfficeSubmissionEntity[]} organisations 
     * @param {BackOfficeSubmissionEntity[]} contacts 
     * @param {BackOfficeSubmissionEntity} appeal 
     * @param {BackOfficeSubmissionEntity[]} documents 
     */
    constructor(organisations, contacts, appeal, documents) {
        this.#organisations = organisations;
        this.#contacts = contacts;
        this.#appeal = appeal;
        this.#documents = documents;
    }

    getAppealId() {
        return this.#appeal.getId();
    }
}

module.exports = BackOfficeAppealSubmissionAggregate;