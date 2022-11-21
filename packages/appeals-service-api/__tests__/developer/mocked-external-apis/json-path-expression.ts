export class JsonPathExpression {
    constructor(private expression: string){}

    get(): string {
        return this.expression
    }
}