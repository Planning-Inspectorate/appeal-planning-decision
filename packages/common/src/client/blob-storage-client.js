const { DefaultAzureCredential } = require('@azure/identity');
const {
	BlobServiceClient,
	BlobSASPermissions,
	SASProtocol,
	generateBlobSASQueryParameters
} = require('@azure/storage-blob');
const logger = require('../lib/logger');
const BlobStorageError = require('./blob-storage-error');
const getAzureBlobPathFromUri = require('../lib/getAzureBlobPathFromUri');

const trailingSlashRegex = /\/$/;

/**
 * todo: seed local files
 * todo: get user delegation working locally - requires self signed cert trusted in docker + browser
 */
class BlobStorageClient {
	/**
	 * @param {string} host - host for blob account
	 * @param {string} [connectionString] - if possible leave this undefined, fallback option for if user delegation doesn't work
	 */
	constructor(host, connectionString) {
		if (!host) {
			throw new Error('host is required');
		}

		this.host = host.replace(trailingSlashRegex, '');
		this.accountName = new URL(this.host).hostname.split('.')[0];

		if (!connectionString) {
			// use azure rbac + managed identity to access (preferred route)
			this.blobServiceClient = new BlobServiceClient(this.host, new DefaultAzureCredential());
			this.isSharedKeyCredential = false;
			logger.info('BlobStorageClient using user delegation');
		} else {
			// fallback route
			this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
			this.isSharedKeyCredential = true;
			logger.info('BlobStorageClient using connection string');
		}
	}

	/**
	 * @param {string} containerName
	 * @param {string} blobName
	 * @returns {import('@azure/storage-blob').BlockBlobClient}
	 */
	#getBlockBlobClient(containerName, blobName) {
		const containerClient = this.blobServiceClient.getContainerClient(containerName);
		return containerClient.getBlockBlobClient(blobName);
	}

	/**
	 * Generates a url with short lived access to the given blob
	 * @param {string} containerName - Blob storage container name
	 * @param {string} blobName - Blob name e.g. doc/path/file.txt or complete uri to blob
	 * @param {Date} [expiresOn] The end time for the user delegation SAS. Must be within 7 days of the current time, defaults to 10 mins from now
	 * @param {string} [filename]
	 * @returns {Promise<string>} - empty string if the
	 */
	async getBlobSASUrl(containerName, blobName, expiresOn, filename) {
		const TEN_MINUTES = 10 * 60 * 1000;
		const NOW = new Date();
		const startsOn = new Date(NOW.valueOf() - TEN_MINUTES);

		blobName = getAzureBlobPathFromUri(blobName, this.host, containerName);

		if (!expiresOn) {
			expiresOn = new Date(NOW.valueOf() + TEN_MINUTES);
		}

		logger.info(`creating sas: ${this.host}/${containerName}/${blobName} expires: ${expiresOn}`);

		const blob = this.#getBlockBlobClient(containerName, blobName);

		if (!(await blob.exists())) {
			logger.error('blob does not exist');
			throw new BlobStorageError('blob does not exist', 404);
		}

		const blobPermissions = 'r'; // read permission

		if (this.isSharedKeyCredential) {
			logger.info(`creating shared-key sas url`);

			const urlFields = {
				protocol: SASProtocol.HttpsAndHttp,
				startsOn: startsOn,
				expiresOn: expiresOn,
				permissions: BlobSASPermissions.parse(blobPermissions)
			};

			const sharedKeySasUrlOptions = !filename
				? urlFields
				: {
						...urlFields,
						contentDisposition: `attachment; filename="${filename}"`
					};

			let url = await blob.generateSasUrl(sharedKeySasUrlOptions);

			// fix for localhost, replace docker dns with localhost entry
			const path = url.split(':10000/devstoreaccount1/');
			if (path.length === 2) {
				url = `${this.host}/${path[1]}`;
			}

			return url;
		}

		logger.info(`creating user delegation sas url`);

		// https://learn.microsoft.com/en-us/rest/api/storageservices/create-user-delegation-sas
		const userDelegationKey = await this.blobServiceClient.getUserDelegationKey(
			startsOn,
			expiresOn
		);

		const delegationSasFields = {
			blobName,
			containerName,
			permissions: BlobSASPermissions.parse(blobPermissions),
			protocol: SASProtocol.Https,
			startsOn: startsOn,
			expiresOn: expiresOn
		};

		const delegationSasOptions = !filename
			? delegationSasFields
			: {
					...delegationSasFields,
					contentDisposition: `attachment; filename="${filename}"`
				};

		// https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json#sas-token
		const sasToken = generateBlobSASQueryParameters(
			delegationSasOptions,
			userDelegationKey,
			this.accountName
		).toString();

		return `${this.host}/${containerName}/${blobName}?${sasToken}`;
	}

	/**
	 * downloads blob and returns as a stream
	 * @param {string} containerName - Blob storage container name
	 * @param {string} blobName - Blob storage container name
	 * @returns {Promise<import('@azure/storage-blob').BlobGetPropertiesResponse>}
	 */
	async getProperties(containerName, blobName) {
		const blob = this.#getBlockBlobClient(containerName, blobName);

		if (!(await blob.exists())) {
			logger.error(`blob ${blobName} does not exist`);
			throw new BlobStorageError('blob does not exist', 404);
		}

		logger.info(`get metadata for: ${this.host}/${containerName}/${blobName}`);

		return blob.getProperties();
	}

	/**
	 * downloads blob and returns as a stream
	 * @param {string} containerName - Blob storage container name
	 * @param {string} blobName - Blob storage container name
	 * @returns {Promise<import('@azure/storage-blob').BlobDownloadResponseParsed>}
	 */
	async downloadBlob(containerName, blobName) {
		const blob = this.#getBlockBlobClient(containerName, blobName);

		if (!(await blob.exists())) {
			logger.error(`blob ${blobName} does not exist`);
			throw new BlobStorageError('blob does not exist', 404);
		}

		logger.info(`downloading: ${this.host}/${containerName}/${blobName}`);

		return blob.download();
	}

	/**
	 * uploads file to container, requires create permissions for the given container
	 * @param {string} containerName - Blob storage container name
	 * @param {string} blobName - Blob name, may include path
	 * @param {Object<string,string>} metadata - PINs Data Model metadata, requires contentType
	 * @param {import('node:stream').Readable} fileStream - file
	 * @returns {Promise<import('@azure/storage-blob').BlobUploadCommonResponse>}
	 */
	async uploadBlob(containerName, blobName, metadata, fileStream) {
		const containerClient = this.blobServiceClient.getContainerClient(containerName);

		await containerClient.createIfNotExists();

		const blob = containerClient.getBlockBlobClient(blobName);

		logger.info(`uploading file: ${this.host}/${containerName}/${blobName}`);

		return await blob.uploadStream(fileStream, undefined, undefined, {
			blobHTTPHeaders: {
				blobContentType: metadata.contentType
			},
			metadata: metadata
		});
	}
}

module.exports = BlobStorageClient;
