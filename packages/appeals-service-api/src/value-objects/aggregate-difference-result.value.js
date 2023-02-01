class AggregateDifference {

    #aggregateId
    #entityDifferences

    /**
     * 
     * @param {string} aggregateId 
     * @param {BackOfficeSubmissionEntity[]} entityEifferences 
     */
    constructor(aggregateId, entityDifferences) {
        this.#aggregateId = aggregateId;
        this.#entityDifferences = entityDifferences;
    }

    getAggregateId() { return this.#aggregateId; }
    getEntityDifferences() { return this.#entityDifferences; }
    toJSON() {
        return {
            aggregateId: this.#aggregateId,
            entityDifferences: this.#entityDifferences.map(difference => difference.toJSON())
        }
    }
}

module.exports = AggregateDifference;