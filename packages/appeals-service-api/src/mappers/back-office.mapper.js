const BackOfficeAppealSubmissionAggregate = require("../models/aggregates/back-office-appeal-submission.aggregate");
const BackOfficeSubmissionEntity = require("../models/entities/back-office-submission-entity");

class BackOfficeMapper {

    /**
     * 
     * @param {AppealContactsValueObject} appealContactDetails 
     * @param {string} appealId 
     * @param {string[]} documentIds 
     * @returns 
     */
    appealToAppealToBeSubmittedJson(appealContactDetails, appealId, documentIds) {
        return {
			organisations: this.#getOrganisationsJson(appealContactDetails),
			contacts: this.#getContactsJson(appealContactDetails) ,
			appeal: { horizon_id: "", id: appealId, failures: [] },
			documents: this.#getDocumentsJson(documentIds)
		}
    }

    fromJsonToBackOfficeAppealSubmission(json){
        const organisations = json
            .organisations
            .map(organisationJson => new BackOfficeSubmissionEntity(
                organisationJson.type,
                organisationJson.horizon_id 
            ));

        const contacts = json
            .contacts
            .map(contactJson => new BackOfficeSubmissionEntity(
                contactJson.type,
                contactJson.horizon_id 
            ));

        const appeal = new BackOfficeSubmissionEntity(json.appeal.id, json.appeal.horizon_id);

        const documents = json
            .documents
            .map(documentJson => new BackOfficeSubmissionEntity(
                documentJson.id,
                documentJson.horizon_id
            ));

        return new BackOfficeAppealSubmissionAggregate(
            organisations,
            contacts,
            appeal,
            documents
        );
    }

    #getOrganisationsJson(appealContactDetails) {
        const result = [];
        // Check for names here: if one hasn't been set, its because the organisation for the type
        // of contact was never defined on the appeal.
        if (appealContactDetails.getAppellant().getOrganisationName()) result.push({"horizon_id": "", "type": "appellant", "failures": []});
        if (appealContactDetails.getAgent().getOrganisationName()) result.push({"horizon_id": "", "type": "agent", "failures": []});
        return result;
    }

    #getContactsJson(appealContactDetails) {
        const result = [];
        // Check for names here: if one hasn't been set, its because the contact for the type
        // of contact was never defined on the appeal.
        if (appealContactDetails.getAppellant().getName()) result.push({"horizon_id": "", "type": "appellant", "failures": []});
        if (appealContactDetails.getAgent().getName()) result.push({"horizon_id": "", "type": "agent", "failures": []});
        return result;
    }

    #getDocumentsJson(documentIds){
        return documentIds.map(documentId => { return { horizon_id: "", id: documentId, failures: []} })
    }
}

module.exports = BackOfficeMapper;