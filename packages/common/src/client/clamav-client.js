const NodeClam = require('clamscan');
const fs = require('fs');
const logger = require('../lib/logger');

const trailingSlashRegex = /\/$/;

class ClamAVClient {
	/**
	 * @param {string} host - e.g. https://example.com
	 * @param {number} port - e.g. 4000
	 */
	constructor(host, port) {
		if (!host) {
			throw new Error('host is required');
		}

		/** @type {string} */
		this.host = host.replace(trailingSlashRegex, '');
		this.port = port;
	}

	/**
	 * @returns {Promise<NodeClam>}
	 */
	async #connect() {
		if (this.clamScan) return this.clamScan;

		this.clamScan = await new NodeClam().init({
			removeInfected: true,
			clamdscan: {
				host: this.host,
				port: this.port,
				active: true,
				bypassTest: false
			},
			preference: 'clamdscan'
		});

		const version = await this.clamScan.getVersion();
		logger.info(`ClamAV Version: ${version}`);

		return this.clamScan;
	}

	/**
	 * sends file to clamav
	 * @param {import('express-fileupload').UploadedFile} fileInformation
	 * @param {string} fileName
	 * @returns {Promise<boolean>} true if file is ok, otherwise will throw
	 */
	async scan(fileInformation, fileName) {
		const readableStream = fs.createReadStream(fileInformation?.tempFilePath);

		const clamScan = await this.#connect();

		try {
			logger.info(`sending ${fileName} to clamav`);

			const result = await clamScan.scanStream(readableStream);

			// If is infected is null or undefined (which can happen in certain cases) then throw an error
			if (result.isInfected == null) {
				throw new Error(`Could not scan ${fileName}`);
			}

			if (result.isInfected === true) {
				throw new Error(`${fileName} contains a virus`);
			}

			return true;
		} catch (error) {
			logger.error(error, `error uploading ${fileName} to clamav`);
			throw error;
		}
	}
}

module.exports = ClamAVClient;
