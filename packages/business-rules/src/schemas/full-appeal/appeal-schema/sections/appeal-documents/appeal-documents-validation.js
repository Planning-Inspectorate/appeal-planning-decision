const { PLANNING_OBLIGATION_STATUS_OPTION } = require('../../../../../constants');
const pinsYup = require('../../../../../lib/pins-yup');

const appealDocumentsValidation = () => {
	return pinsYup
		.object()
		.shape({
			appealStatement: pinsYup
				.object()
				.shape({
					uploadedFile: pinsYup
						.object()
						.shape({
							id: pinsYup.string().trim().uuid().nullable().default(null),
							name: pinsYup.string().trim().max(255).ensure(),
							fileName: pinsYup.string().trim().max(255).ensure(),
							originalFileName: pinsYup.string().trim().max(255).ensure(),
							location: pinsYup.string().trim().nullable(),
							size: pinsYup.number().nullable()
						})
						.noUnknown(true),
					hasSensitiveInformation: pinsYup.bool().nullable().default(null)
				})
				.noUnknown(true),
			plansDrawings: pinsYup
				.object()
				.shape({
					hasPlansDrawings: pinsYup.bool().nullable().default(null),
					uploadedFiles: pinsYup
						.array()
						.of(
							pinsYup
								.object()
								.shape({
									id: pinsYup.string().trim().uuid().nullable().default(null),
									name: pinsYup.string().trim().max(255).ensure(),
									fileName: pinsYup.string().trim().max(255).ensure(),
									originalFileName: pinsYup.string().trim().max(255).ensure(),
									location: pinsYup.string().trim().nullable(),
									size: pinsYup.number().nullable()
								})
								.noUnknown(true)
						)
						.ensure()
				})
				.noUnknown(true),

			planningObligations: pinsYup.object().shape({
				plansPlanningObligation: pinsYup.bool().nullable().default(null),
				planningObligationStatus: pinsYup.lazy((planningObligationStatus) => {
					if (planningObligationStatus) {
						return pinsYup.string().oneOf(Object.values(PLANNING_OBLIGATION_STATUS_OPTION));
					}
					return pinsYup.string().nullable();
				}),
				uploadedFiles: pinsYup
					.array()
					.of(
						pinsYup
							.object()
							.shape({
								id: pinsYup.string().trim().uuid().nullable().default(null),
								name: pinsYup.string().trim().max(255).ensure(),
								fileName: pinsYup.string().trim().max(255).ensure(),
								originalFileName: pinsYup.string().trim().max(255).ensure(),
								location: pinsYup.string().trim().nullable(),
								size: pinsYup.number().nullable()
							})
							.noUnknown(true)
					)
					.ensure()
			}),
			draftPlanningObligations: pinsYup.object().shape({
				plansPlanningObligation: pinsYup.bool().nullable().default(null),
				planningObligationStatus: pinsYup.lazy((planningObligationStatus) => {
					if (planningObligationStatus) {
						return pinsYup.string().oneOf(Object.values(PLANNING_OBLIGATION_STATUS_OPTION));
					}
					return pinsYup.string().nullable();
				}),
				uploadedFiles: pinsYup
					.array()
					.of(
						pinsYup
							.object()
							.shape({
								id: pinsYup.string().trim().uuid().nullable().default(null),
								name: pinsYup.string().trim().max(255).ensure(),
								fileName: pinsYup.string().trim().max(255).ensure(),
								originalFileName: pinsYup.string().trim().max(255).ensure(),
								location: pinsYup.string().trim().nullable(),
								size: pinsYup.number().nullable()
							})
							.noUnknown(true)
					)
					.ensure()
			}),
			planningObligationDeadline: pinsYup.object().shape({
				plansPlanningObligation: pinsYup.bool().nullable().default(null),
				planningObligationStatus: pinsYup.lazy((planningObligationStatus) => {
					if (planningObligationStatus) {
						return pinsYup.string().oneOf(Object.values(PLANNING_OBLIGATION_STATUS_OPTION));
					}
					return pinsYup.string().nullable();
				})
			}),
			supportingDocuments: pinsYup
				.object()
				.shape({
					hasSupportingDocuments: pinsYup.bool().nullable().default(null),
					uploadedFiles: pinsYup
						.array()
						.of(
							pinsYup
								.object()
								.shape({
									id: pinsYup.string().trim().uuid().nullable().default(null),
									name: pinsYup.string().trim().max(255).ensure(),
									fileName: pinsYup.string().trim().max(255).ensure(),
									originalFileName: pinsYup.string().trim().max(255).ensure(),
									location: pinsYup.string().trim().nullable(),
									size: pinsYup.number().nullable()
								})
								.noUnknown(true)
						)
						.ensure()
				})
				.noUnknown(true)
		})
		.noUnknown(true);
};

module.exports = appealDocumentsValidation;
