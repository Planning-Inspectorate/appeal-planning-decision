class BackOfficeSubmissionEntity {

    #id
    #backOfficeId

    /**
     * 
     * @param {String} id Some identifier for the entity. 
     * @param {String} backOfficeId The ID that maps the entity identified by the `id` parameter
     * to its representation in the back-office.
     */
    constructor(id, backOfficeId) {
        this.#id = id;
        this.#backOfficeId = backOfficeId;
    }

    getId() {
        return this.#id;
    }
}

module.exports = BackOfficeSubmissionEntity;