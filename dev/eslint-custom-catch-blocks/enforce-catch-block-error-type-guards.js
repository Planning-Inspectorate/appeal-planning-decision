module.exports = {
	meta: {
		type: 'suggestion',
		version: '0.0.1',
		name: 'eslint-plugin-enforce-catch-block-error-type-guards',
		hasSuggestions: true,
		fixable: 'code',
		docs: {
			description: 'Warn against the use of non type safe code in catch blocks',
			category: 'Possible errors'
		},
		schema: []
	},
	create(context) {
		const findParentNodeOfType = (node, parentType) => {
			let parent = node;
			while (parent) {
				parent = parent.parent;
				if (parent && parent.type === parentType) {
					return parent;
				}
			}
		};

		const getName = (node) => {
			if (node.name) return node.name;
			if (node.object) return getName(node.object);
			return null;
		};

		return {
			ExpressionStatement(node) {
				const catchClause = findParentNodeOfType(node, 'CatchClause');
				if (!catchClause) return;

				const value = node.expression.right;
				if (!value) return;

				const { param } = catchClause;

				if (
					value.type !== 'MemberExpression' ||
					!value.object ||
					getName(value.object) !== param.name
				)
					return;

				let prop = value.property;
				let e = new Error();
				// eslint-disable-next-line no-prototype-builtins
				if (e.hasOwnProperty(prop.name)) return;

				let ifStatement = findParentNodeOfType(node, 'IfStatement');
				if (ifStatement && ifStatement.test.left?.name === param.name) return;

				let isProblem = true;

				for (const statement of catchClause.body.body) {
					if (
						statement.type === 'IfStatement' &&
						statement.test.type === 'UnaryExpression' &&
						statement.test.operator === '!' &&
						statement.test.argument.type === 'BinaryExpression' &&
						statement.test.argument.operator === 'instanceof' &&
						statement.test.argument.left.type === 'Identifier' &&
						statement.test.argument.left.name === param.name
					) {
						isProblem = false;
						break;
					}
				}

				if (!isProblem) return;
				context.report({
					node: node,
					message: `Catch block relies on calling ${param.name} object with non standard properties without type guard`,
					data: {
						identifier: node.name
					},
					suggest: [
						{
							desc: 'Try adding an if statement around these statements, within the body of the catch block',
							fix: function (fixer) {
								return [
									fixer.insertTextBeforeRange(
										[catchClause.body.range[0] + 1, catchClause.body.range[1]],
										`if(${param.name} instanceof ApiError) {`
									),
									fixer.insertTextAfterRange(
										[catchClause.body.range[0], catchClause.body.range[1] - 1],
										'}'
									)
								];
							}
						}
					],
					loc: node.loc
				});
			}
		};
	}
};
