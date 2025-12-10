const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@pins/database/src/client/client').AppellantSubmission} AppellantSubmission
 */

/**
 * @typedef {Object} DocumentUploadData
 * @property {string} id
 * @property {string} name
 * @property {string} fileName
 * @property {string} originalFileName
 * @property {string} location
 * @property {string} type
 */

class SubmissionDocumentUploadRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create submission document for given questionnaire
	 *
	 * @param {string} id
	 * @param {DocumentUploadData[]} uploadData
	 * @returns {Promise<AppellantSubmission>}
	 */
	async createSubmissionDocument(id, uploadData) {
		const mappedUploadData = uploadData.map((file) => {
			let correctedOriginalFileName = file.originalFileName;
			try {
				const buffer = Buffer.from(file.originalFileName, 'latin1');
				correctedOriginalFileName = buffer.toString('utf8');
			} catch (e) {
				console.error('Failed to fix Mojibake', e);
			}

			const correctBaseName = correctedOriginalFileName.substring(
				0,
				correctedOriginalFileName.lastIndexOf('.')
			);
			const correctExtension = correctedOriginalFileName.substring(
				correctedOriginalFileName.lastIndexOf('.')
			);

			let correctedStorageName = file.name;
			try {
				const parts = file.name.split('-');
				if (parts.length > 5) {
					const uuidPrefix = parts.slice(0, 5).join('-');

					correctedStorageName = `${uuidPrefix}-${correctBaseName}${correctExtension}`;
				} else {
					correctedStorageName = file.name.replace(/---(\.pdf)$/i, correctExtension);
				}
			} catch (e) {
				console.error('Failed to correct storage name format:', e);
				correctedStorageName = file.name;
			}

			return {
				name: correctedStorageName,
				fileName: correctedStorageName,
				originalFileName: correctedOriginalFileName,
				location: file.location.replace(file.name, correctedStorageName),
				type: file.type,
				storageId: file.id
			};
		});

		return await this.dbClient.appellantSubmission.update({
			where: {
				id
			},
			data: {
				SubmissionDocumentUpload: {
					createMany: {
						data: mappedUploadData
					}
				}
			},
			include: {
				SubmissionDocumentUpload: true,
				SubmissionAddress: true,
				SubmissionLinkedCase: true
			}
		});
	}

	/**
	 * Delete submission document
	 *
	 * @param {string} id
	 * @param {string[]} documentIds
	 * @returns {Promise<AppellantSubmission>}
	 */
	async deleteSubmissionDocument(id, documentIds) {
		return await this.dbClient.appellantSubmission.update({
			where: {
				id
			},
			data: {
				SubmissionDocumentUpload: {
					deleteMany: {
						id: { in: documentIds }
					}
				}
			},
			include: {
				SubmissionDocumentUpload: true,
				SubmissionAddress: true,
				SubmissionLinkedCase: true
			}
		});
	}
}

module.exports = { SubmissionDocumentUploadRepository };
