const { MESSAGE_EVENT_TYPE } = require('@planning-inspectorate/data-model');

/**
 * @enum {string} EventType
 * this re-exports the data-model enums to avoid refactoring all the code
 */
const EventType = {
	Create: MESSAGE_EVENT_TYPE.CREATE,
	Update: MESSAGE_EVENT_TYPE.UPDATE,
	Delete: MESSAGE_EVENT_TYPE.DELETE,
	Publish: MESSAGE_EVENT_TYPE.PUBLISH,
	Unpublish: MESSAGE_EVENT_TYPE.UNPUBLISH
};

module.exports = { EventType };
