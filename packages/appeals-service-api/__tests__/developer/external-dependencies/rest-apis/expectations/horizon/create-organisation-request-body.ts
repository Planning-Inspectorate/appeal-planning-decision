import { RequestBodyExpectation } from "../request-body-expectation";

export class HorizonCreateOrganisationRequestBodyExpectation extends RequestBodyExpectation {
    private organisationName: string | any;

    constructor(organisationName: string | any) {
        super(typeof organisationName == "string" ? 8 : 9);
        this.organisationName = organisationName;
    }

    getOrganisationName(): string| any {
        return this.organisationName;
    }
}