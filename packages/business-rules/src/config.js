const { format } = require('date-fns');
const {
	APPEAL_ID,
	PROCEDURE_TYPE: { WRITTEN_REPRESENTATION, HEARING, INQUIRY }
} = require('./constants');

/**
 * @type {{appeal: { type: Record<string, {
 * id: string,
 * name: string,
 * procedureType: string[],
 * appealDue: Record<string, {time: number, duration: string}|{time: number, duration: string}>,
 * questionnaireDue: {time: number, duration: string},
 * email?: Record<string, function>
 * }>}}}
 */ // todo: remove unused email config
const config = {
	appeal: {
		type: {
			[APPEAL_ID.ENFORCEMENT_NOTICE]: {
				id: 'C',
				name: 'Enforcement Notice Appeal',
				procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
				appealDue: {
					time: 28,
					duration: 'days'
				},
				questionnaireDue: {
					time: 2,
					duration: 'weeks'
				}
			},
			[APPEAL_ID.HOUSEHOLDER]: {
				id: 'D',
				name: 'Householder Appeal (HAS)',
				procedureType: [WRITTEN_REPRESENTATION],
				appealDue: {
					granted: {
						time: 6,
						duration: 'months'
					},
					refused: {
						time: 84,
						duration: 'days',
						description: '12 weeks'
					},
					nodecisionreceived: {
						time: 6,
						duration: 'months'
					}
				},
				questionnaireDue: {
					time: 1,
					duration: 'weeks'
				},
				email: {
					saveAndReturnContinueAppeal: (appeal, baseUrl, deadlineDate) => ({
						recipientEmail: appeal.email,
						variables: {
							applicationNumber: appeal.planningApplicationNumber,
							date: format(deadlineDate, 'dd MMMM yyyy'),
							link: `${baseUrl}/appeal-householder-decision/enter-code/${appeal.id}`
						},
						reference: appeal.id
					}),
					confirmEmail: (appeal, baseUrl) => ({
						recipientEmail: appeal.email,
						variables: { link: `${baseUrl}/appeal-householder-decision/email-address-confirmed` },
						reference: appeal.id
					})
				}
			},
			[APPEAL_ID.ENFORCEMENT_LISTED_BUILDING]: {
				id: 'F',
				name: 'Enforcement Listed Building and Conservation Area Appeal S39',
				procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
				appealDue: {
					time: 6,
					duration: 'months'
				},
				questionnaireDue: {
					time: 2,
					duration: 'weeks'
				}
			},
			[APPEAL_ID.ADVERTISEMENT]: {
				id: 'H',
				name: 'Advertisement Appeal',
				procedureType: [WRITTEN_REPRESENTATION, HEARING],
				appealDue: {
					time: 8,
					duration: 'weeks'
				},
				questionnaireDue: {
					time: 2,
					duration: 'weeks'
				}
			},
			[APPEAL_ID.PLANNING_OBLIGATION]: {
				id: 'Q',
				name: 'Planning Obligation Appeal S106',
				procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
				appealDue: {
					time: 6,
					duration: 'months'
				},
				questionnaireDue: {
					time: 2,
					duration: 'weeks'
				}
			},
			[APPEAL_ID.PLANNING_SECTION_78]: {
				id: 'W',
				name: 'Planning Appeal Section 78',
				procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
				appealDue: {
					time: 6,
					duration: 'months'
				},
				questionnaireDue: {
					time: 1,
					duration: 'weeks'
				},
				email: {
					saveAndReturnContinueAppeal: (appeal, baseUrl, deadlineDate) => ({
						recipientEmail: appeal.email,
						variables: {
							applicationNumber: appeal.planningApplicationNumber,
							date: format(deadlineDate, 'dd MMMM yyyy'),
							link: `${baseUrl}/full-appeal/submit-appeal/enter-code/${appeal.id}`
						},
						reference: appeal.id
					}),
					confirmEmail: (appeal, baseUrl) => ({
						recipientEmail: appeal.email,
						variables: {
							link: `${baseUrl}/full-appeal/submit-appeal/email-address-confirmed`
						},
						reference: appeal.id
					})
				}
			},
			[APPEAL_ID.PLANNING_LISTED_BUILDING]: {
				id: 'Y',
				name: 'Planning Listed Building and Conservation Area Appeal S20',
				procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
				appealDue: {
					time: 6,
					duration: 'months'
				},
				questionnaireDue: {
					time: 1,
					duration: 'weeks'
				}
			},
			[APPEAL_ID.MINOR_COMMERCIAL_ADVERTISEMENT]: {
				id: 'ZA',
				name: 'Commercial Adverts Appeal (CAS)',
				procedureType: [WRITTEN_REPRESENTATION],
				appealDue: {
					time: 8,
					duration: 'weeks'
				},
				questionnaireDue: {
					time: 1,
					duration: 'weeks'
				}
			},
			[APPEAL_ID.MINOR_COMMERCIAL]: {
				id: 'ZP',
				name: 'Minor Commercial (shopfront)',
				procedureType: [WRITTEN_REPRESENTATION],
				appealDue: {
					time: 12,
					duration: 'weeks'
				},
				questionnaireDue: {
					time: 1,
					duration: 'weeks'
				}
			},
			[APPEAL_ID.HEDGEROW]: {
				id: '5',
				name: 'Hedgerow',
				procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
				appealDue: {
					time: 28,
					duration: 'days'
				},
				questionnaireDue: {
					time: 2,
					duration: 'weeks'
				}
			},
			[APPEAL_ID.HIGH_HEDGES]: {
				id: '5',
				name: 'High hedges',
				procedureType: [WRITTEN_REPRESENTATION],
				appealDue: {
					time: 28,
					duration: 'days'
				},
				questionnaireDue: {
					time: 2,
					duration: 'weeks'
				}
			},
			[APPEAL_ID.FAST_TRACK_TREES]: {
				id: '',
				name: 'Fast Track Trees/Trees',
				procedureType: [WRITTEN_REPRESENTATION, HEARING],
				appealDue: {
					time: 28,
					duration: 'days'
				},
				questionnaireDue: {
					time: 2,
					duration: 'weeks'
				}
			},
			[APPEAL_ID.LAWFUL_DEVELOPMENT_CERTIFICATE]: {
				id: 'X',
				name: 'Lawful development certificate',
				procedureType: [WRITTEN_REPRESENTATION, HEARING, INQUIRY],
				appealDue: {
					time: 6,
					duration: 'months'
				},
				questionnaireDue: {
					time: 2,
					duration: 'weeks'
				}
			}
		}
	}
};

module.exports = config;
