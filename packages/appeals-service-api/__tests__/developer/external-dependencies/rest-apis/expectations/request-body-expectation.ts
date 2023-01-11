export class RequestBodyExpectation {
    private numberOfJsonKeys: number;

    constructor(numberOfJsonKeys: number) {
        this.numberOfJsonKeys = numberOfJsonKeys;
    }

    getNumberOfJsonKeys(): number {
        return this.numberOfJsonKeys;
    }

    protected incrementNumberOfJsonKeys() {
        this.numberOfJsonKeys++;
    }
}