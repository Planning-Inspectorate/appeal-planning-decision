import { RequestBodyExpectation } from "../request-body-expectation";
import { HorizonCreateAppealContactExpectation } from "./create-appeal-contact";

export class HorizonCreateAppealRequestBodyExpectation extends RequestBodyExpectation {
    private appealType: string;
    private lpaCode: string;
    private lpaCountry: string;
    private caseworkReason: string;
    private decisionDate: Date;
    private caseProcedure: string;
    private ownershipCertificate: string;
    private contacts: Array<HorizonCreateAppealContactExpectation>;

    constructor(
        appealType: string,
        lpaCode: string,
        lpaCountry: string,
        caseworkReason: string,
        decisionDate: Date,
        caseProcedure: string,
        ownershipCertificate: string,
        contacts: Array<HorizonCreateAppealContactExpectation>
    ) {
        super(71 + (24 * contacts.length));
        this.appealType = appealType;
        this.lpaCode = lpaCode;
        this.lpaCountry = lpaCountry;
        this.caseworkReason = caseworkReason;
        this.decisionDate = decisionDate;
        this.caseProcedure = caseProcedure;
        this.ownershipCertificate = ownershipCertificate;
        this.contacts = contacts;
    }

    getAppealType(): string {
        return this.appealType;
    }

    getLpaCode(): string {
        return this.lpaCode;
    }

    getLpaCountry(): string {
        return this.lpaCountry;
    }

    getCaseworkReason(): string {
        return this.caseworkReason;
    }

    getDecisionDate(): Date {
        return this.decisionDate;
    }

    getCaseProcedure(): string {
        return this.caseProcedure;
    }

    getOwnershipCertificate(): string {
        return this.ownershipCertificate;
    }

    getContacts(): Array<HorizonCreateAppealContactExpectation> {
        return this.contacts;
    }
}