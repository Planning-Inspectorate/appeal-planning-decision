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

    getBackOfficeId() {
        return this.#backOfficeId;
    }

    isPending() {
        return this.#backOfficeId == false;
    }

    toJSON() {
        return { id: this.#id, backOfficeId: this.#backOfficeId };
    }
}

module.exports = BackOfficeSubmissionEntity;