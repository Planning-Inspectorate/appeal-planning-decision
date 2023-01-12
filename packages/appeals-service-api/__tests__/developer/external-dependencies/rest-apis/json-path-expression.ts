export class JsonPathExpression {
	static create(expression: string): JsonPathExpression {
		return new JsonPathExpression(expression);
	}

	private constructor(private expression: string) {}

	get(): string {
		return this.expression;
	}

	toString(): string {
		return this.expression;
	}
}
