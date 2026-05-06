const fs = require('node:fs/promises');
const path = require('node:path');

/**
 * @param {Object} options
 * @param {number} [options.sizeInMB] - e.g. 0.001 for 1KB, 0.1 for 100KB, 1 for 1MB, etc.
 * @param {string} [options.fileName] - e.g. test.jpg
 * @returns {Promise<void>} generates a jpg file in the generated fixtures folder with the given name and size
 */
exports.generateTestJpg = async ({ sizeInMB = 0.001, fileName = 'test-image.jpg' } = {}) => {
    if (fileName.includes(path.sep)) {
        throw new Error('fileName should not include path separators');
    }
    if (fileName.endsWith('.jpeg') === false && fileName.endsWith('.jpg') === false) {
        throw new Error('fileName should end with .jpeg or .jpg');
    }

    const resolvedPath = path.join(__dirname, 'generated', fileName);

    await fs.mkdir(path.dirname(resolvedPath), { recursive: true });

    const targetBytes = Math.floor(sizeInMB * 1024 * 1024);

    // Get base JPEG
    const BASE_JPEG = await getBaseJpeg();
    if (targetBytes < BASE_JPEG.length) {
        throw new Error(`Target (${targetBytes}) smaller than base JPEG`);
    }

    // generate padding bytes
    const finalJpeg = Buffer.concat([
        BASE_JPEG,
        Buffer.alloc(targetBytes - BASE_JPEG.length, 0)
    ]);

    // write file to disk
    await fs.writeFile(resolvedPath, finalJpeg);
}

/**
 * gets buffer from base jpeg file
 * @returns {Buffer} buffer of base jpeg file
 */
async function getBaseJpeg() {
    const baseJpegFile = await fs.readFile(path.join(__dirname, 'base.jpg'));
    const BASE_JPEG = Buffer.from(
        baseJpegFile.toString('base64'),
        'base64'
    );

    return BASE_JPEG;
}
