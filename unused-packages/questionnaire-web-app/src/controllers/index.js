const questionnaire = {
    "title": "Householder appeal",
    "sections": [
        {
            "name": "Constraints, designations and other issues",
            "questions": [
                {
                    "question": "Would a public right of way need to be removed or diverted?",
                    "type": "boolean",
                    "fieldName": "right-of-way-check",
                    "required": true,
                    "answers":[{"true": {"actionUrl":"/"}, "false": {"actionUrl":"/"}}],
                    "value": null
                },
                {
                    "question": "Upload the definitive map and statement extract",
                    "type": "multi-file-upload",
                    "fieldName": "right-of-way-upload",
                    "required": true,
                    "value": null
                },
                {
                    "question": "The last question?",
                    "type": "boolean",
                    "fieldName": "last-question-check",
                    "required": true,
                    "answers":[{"true": {"actionUrl":"/"}, "false": {"actionUrl":"/"}}],
                    "value": null
                }
            ]
        }
    ]
}
exports.getIndex = async (req, res) => {

	return res.render(`questions/boolean`, {
		
		questionnaireTitle: questionnaire.title,
		question: questionnaire.sections[0].questions[0].question,
		fieldName: questionnaire.sections[0].questions[0].fieldName,
		title: questionnaire.title,
		value: null
	 });
};

exports.continue = (req, res) => {
	console.log(req)
}





