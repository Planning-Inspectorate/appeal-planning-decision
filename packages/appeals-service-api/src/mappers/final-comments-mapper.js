const { FinalCommentsAggregate } = require('../models/aggregates/final-comments-aggregate');
const { SecureCodeEntity } = require('../models/entities/secure-code-entity');

class FinalCommentsMapper {

    /**
     * 
     * @param {any} json 
     * @returns {FinalCommentsAggregate}
     * 
     */
    fromJson(json) {
        const secureCodeEntity = new SecureCodeEntity(json.secureCode.pin, json.secureCode.expiration);
        return new FinalCommentsAggregate(json.caseReference, json.appellantEmail, secureCodeEntity);
    }
}

module.exports = { FinalCommentsMapper }