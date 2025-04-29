/**
 * Using the session to store user displayable messages that can survive an HTTP redirect.
 *
 * @param req the express request object
 * @param message an object in the shape { type: 'success|error', template: 'path/to/template' }
 */
const addFlashMessage = (req, message) => {
	req.session.flashMessages = (req.session.flashMessages || []).concat(message);
};

module.exports = {
	addFlashMessage
};
