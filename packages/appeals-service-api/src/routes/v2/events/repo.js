const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('pins-data-model/src/schemas').AppealEvent} DataModelEvent
 * @typedef {import('@prisma/client').Event} PrismaEvent
 */

/**
 * @param {DataModelEvent} dataModelEvent
 * @returns {Omit<PrismaEvent, 'internalId'>}
 */
const mapDataModelToFODBEvent = (dataModelEvent) => ({
	id: dataModelEvent.eventId,
	type: dataModelEvent.eventType,
	subtype: null,
	name: dataModelEvent.eventName,
	status: dataModelEvent.eventStatus,
	published: !!dataModelEvent.eventPublished,
	startDate: new Date(dataModelEvent.eventStartDateTime),
	endDate: dataModelEvent.eventEndDateTime ? new Date(dataModelEvent.eventEndDateTime) : null,
	isUrgent: dataModelEvent.isUrgent,
	notificationOfSiteVisit: dataModelEvent.notificationOfSiteVisit
		? new Date(dataModelEvent.notificationOfSiteVisit)
		: null,
	caseReference: dataModelEvent.caseReference
});

module.exports = class Repo {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * @param {import('pins-data-model/src/schemas').AppealEvent} data
	 * @returns {Promise<void>}
	 */
	async put(data) {
		return this.dbClient.$transaction(async (tx) => {
			const mappedData = mapDataModelToFODBEvent(data);
			const existingEvent = await tx.event.findFirst({
				where: {
					id: mappedData.id
				}
			});
			if (existingEvent) {
				await tx.event.update({
					where: {
						internalId: existingEvent?.internalId
					},
					data: mappedData
				});
			} else {
				await tx.event.create({
					data: mappedData
				});
			}
		});
	}
};
