class OrganisationNamesValueObject {
    #appellantOrganisationName
    #agentOrganisationName

    /**
     * 
     * @param {*} appellantOrganisationName Optional. Defaults to null.
     * @param {*} agentOrganisationName Optional. Defaults to null
     */
    constructor(appellantOrganisationName = null, agentOrganisationName = null) {
        this.#appellantOrganisationName = appellantOrganisationName;
        this.#agentOrganisationName = agentOrganisationName;
    }

    /**
     * 
     * @returns {string|null}
     */
    getAppellantOrganisationName() {
        return this.#appellantOrganisationName;
    }

    /**
     * 
     * @returns {string|null}
     */
    getAgentOrganisationName() {
        return this.#agentOrganisationName;
    }
}

module.exports = OrganisationNamesValueObject;