// const { getLPAQuestionnaireByAppeal } = require('./repo')
// const logger = require('#lib/logger');
// const ApiError = require('#errors/apiError');

// /**
//  * @type {import('express').Handler}
//  */
// async function getQuestionnaire(req, res) {
// 	try {
// 		const caseReference = req.params.caseReference
// 		const content = await getLPAQuestionnaireByAppeal(caseReference);
// 		if (!content) {
// 			throw ApiError.questionnaireNotFound(caseReference);
// 		}
// 		res.status(200).send(content);
// 	} catch (error) {
// 		if (error instanceof ApiError) {
// 			logger.error(`Failed to get questionnaire: ${error.code} // ${error.message.errors}`);
// 			res.status(error.code || 500).send(error.message.errors);
// 		} else {
// 			logger.error(error);
// 			res.status(500).send('An unexpected error occurred');
// 		}
// 	}
// }

// module.exports = {
// 	getQuestionnaire
// }
