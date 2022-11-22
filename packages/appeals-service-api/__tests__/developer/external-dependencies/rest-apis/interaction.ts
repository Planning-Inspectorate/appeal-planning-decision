import { JsonPathExpression } from "./json-path-expression";

export class Interaction {

    private numberOfKeysExpectedInJson: number = 0;
    private jsonPathStringsToExpectedValues: Map<JsonPathExpression, RegExp | number | string> = new Map([]);

    getNumberOfKeysExpectedInJson(): number{
        return this.numberOfKeysExpectedInJson;
    }

    getJsonPathStringsToExpectedValues(): Map<JsonPathExpression, any> {
        return this.jsonPathStringsToExpectedValues;
    }

    setNumberOfKeysExpectedInJson(numberOfKeysExpected: number): Interaction {
        this.numberOfKeysExpectedInJson = numberOfKeysExpected;
        return this;
    }

    addJsonValueExpectation(expression: JsonPathExpression, value: RegExp | number | string): Interaction {
        this.jsonPathStringsToExpectedValues.set(expression, value);
        return this;
    }
}