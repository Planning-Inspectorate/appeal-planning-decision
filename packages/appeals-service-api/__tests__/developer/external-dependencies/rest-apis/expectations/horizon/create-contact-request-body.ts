import { RequestBodyExpectation } from "../request-body-expectation";

export class HorizonCreateContactRequestBodyExpectation extends RequestBodyExpectation {
    private email: string | any;
    private firstName: string;
    private lastName: string;
    private organisationId: string;

    constructor(
        email: string | any,
        firstName: string,
        lastName: string,
        organisationId: string
    ) {
        super(typeof email == "string" ? 11 : 12);
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.organisationId = organisationId;
    }

    getEmail(): string | any {
        return this.email;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getOrganisationId(): string {
        return this.organisationId;
    }
}