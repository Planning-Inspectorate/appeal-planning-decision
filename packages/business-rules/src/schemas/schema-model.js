const validationActions = {
	insert: ' INSERT',
	update: 'UPDATE'
};

class SchemaModel {
	static validationAction;

	static setValidationAction(valAction) {
		SchemaModel.validationAction = validationActions[valAction];
	}

	static getValidationAction() {
		return SchemaModel.validationAction;
	}
}

module.exports = SchemaModel;
