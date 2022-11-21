import { JsonPathExpression } from "./json-path-expression";

export class Interaction {
    constructor(
        private numberOfKeysExpectedInJson: number,
        private jsonPathStringsToExpectedValues: Map<JsonPathExpression, any>
    ) {}

    getNumberOfKeysExpectedInJson(): number{
        return this.numberOfKeysExpectedInJson;
    }

    getJsonPathStringsToExpectedValues(): Map<JsonPathExpression, any> {
        return this.jsonPathStringsToExpectedValues;
    }
}