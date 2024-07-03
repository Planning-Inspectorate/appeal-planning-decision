const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('pins-data-model/src/schemas').AppealEvent} DataModelEvent
 * @typedef {import('@prisma/client').Event} PrismaEvent
 */

const eventTypeMap = {
	site_visit_access_required: {
		type: 'siteVisit',
		subtype: 'accessRequired'
	},
	site_visit_accompanied: {
		type: 'siteVisit',
		subtype: 'accompanied'
	},
	site_visit_unaccompanied: {
		type: 'siteVisit',
		subtype: 'unaccompanied'
	},
	hearing: {
		type: 'hearing',
		subtype: null
	},
	hearing_virtual: {
		type: 'hearing',
		subtype: 'virtual'
	},
	inquiry: {
		type: 'inquiry',
		subtype: null
	},
	inquiry_virtual: {
		type: 'inquiry',
		subtype: 'virtual'
	},
	in_house: {
		type: 'inHouse',
		subtype: null
	},
	pre_inquiry: {
		type: 'preInquiry',
		subtype: null
	},
	pre_inquiry_virtual: {
		type: 'preInquiry',
		subtype: 'virtual'
	}
};

/**
 * @param {DataModelEvent} dataModelEvent
 * @returns {Omit<PrismaEvent, 'internalId'>}
 */
const mapDataModelToFODBEvent = (dataModelEvent) => ({
	id: dataModelEvent.eventId,
	...eventTypeMap[dataModelEvent.eventType],
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
