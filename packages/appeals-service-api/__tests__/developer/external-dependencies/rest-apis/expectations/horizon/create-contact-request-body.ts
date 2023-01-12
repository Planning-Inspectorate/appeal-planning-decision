import { RequestBodyExpectation } from "../request-body-expectation";

export class HorizonCreateContactRequestBodyExpectation extends RequestBodyExpectation {
    private email: string | any;
    private firstName: string;
    private lastName: string;
    private organisationId: string | null;

    constructor(
        email: string | any,
        firstName: string,
        lastName: string
    ) {
        // By default 10 keys expected
        // If email is null, +1 to keys expected
        // If organisation is specified for that contact, +1 to keys expected
        super(typeof email == "string" ? 10 : 11);
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.organisationId = null;
    }

    setOrganisationId(organisationId: string): void {
        if (this.organisationId == null) {
            this.organisationId = organisationId;
            this.incrementNumberOfJsonKeys();
        }
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

    getOrganisationId(): string | null {
        return this.organisationId;
    }
}