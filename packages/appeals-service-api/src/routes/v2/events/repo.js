const { createPrismaClient } = require('#db-client');
const { APPEAL_EVENT_TYPE } = require('@planning-inspectorate/data-model');
const { EVENT_TYPES, EVENT_SUB_TYPES } = require('@pins/common/src/constants');

/**
 * @typedef {import('@planning-inspectorate/data-model/src/schemas').AppealEvent} DataModelEvent
 * @typedef {import('@pins/database/src/client').Event} PrismaEvent
 */

const eventTypeMap = {
	[APPEAL_EVENT_TYPE.SITE_VISIT_ACCESS_REQUIRED]: {
		type: EVENT_TYPES.SITE_VISIT,
		subtype: EVENT_SUB_TYPES.ACCESS
	},
	[APPEAL_EVENT_TYPE.SITE_VISIT_ACCOMPANIED]: {
		type: EVENT_TYPES.SITE_VISIT,
		subtype: EVENT_SUB_TYPES.ACCOMPANIED
	},
	[APPEAL_EVENT_TYPE.SITE_VISIT_UNACCOMPANIED]: {
		type: EVENT_TYPES.SITE_VISIT,
		subtype: EVENT_SUB_TYPES.UNACCOMPANIED
	},
	[APPEAL_EVENT_TYPE.HEARING]: {
		type: EVENT_TYPES.HEARING,
		subtype: null
	},
	[APPEAL_EVENT_TYPE.HEARING_VIRTUAL]: {
		type: EVENT_TYPES.HEARING,
		subtype: EVENT_SUB_TYPES.VIRTUAL
	},
	[APPEAL_EVENT_TYPE.INQUIRY]: {
		type: EVENT_TYPES.INQUIRY,
		subtype: null
	},
	[APPEAL_EVENT_TYPE.INQUIRY_VIRTUAL]: {
		type: EVENT_TYPES.INQUIRY,
		subtype: EVENT_SUB_TYPES.VIRTUAL
	},
	[APPEAL_EVENT_TYPE.IN_HOUSE]: {
		type: EVENT_TYPES.IN_HOUSE,
		subtype: null
	},
	[APPEAL_EVENT_TYPE.PRE_INQUIRY]: {
		type: EVENT_TYPES.PRE_INQUIRY,
		subtype: null
	},
	[APPEAL_EVENT_TYPE.PRE_INQUIRY_VIRTUAL]: {
		type: EVENT_TYPES.PRE_INQUIRY,
		subtype: EVENT_SUB_TYPES.VIRTUAL
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
	caseReference: dataModelEvent.caseReference,
	addressLine1: dataModelEvent.addressLine1,
	addressLine2: dataModelEvent.addressLine2,
	addressTown: dataModelEvent.addressTown,
	addressCounty: dataModelEvent.addressCounty,
	addressPostcode: dataModelEvent.addressPostcode
});

module.exports = class Repo {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * @param {DataModelEvent} data
	 * @returns {Promise<PrismaEvent>}
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
				return await tx.event.update({
					where: {
						internalId: existingEvent?.internalId
					},
					data: mappedData
				});
			} else {
				return await tx.event.create({
					data: mappedData
				});
			}
		});
	}
};
