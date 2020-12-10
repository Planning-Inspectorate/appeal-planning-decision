const containerClient = require('../lib/containerClient')
const getStream = require('into-stream');
const fs = require('fs');
const mime = require('mime-types');

const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = {
    bufferSize: 4 * ONE_MEGABYTE,
    maxBuffers: 20
};

const DocumentWriter = (req, res) => {
    const deleteFromDisk = async files => {
        await Promise.all(
            files
                .map(async file => {
                    fs.unlink(file.path, (err) => { })
                })
        )
    };
    const uploadToAzureBlobStorage = async files => {
        await Promise.all(
            files
                .map(async file => {
                    fs
                        .readFile(
                            file.path,
                            (err, data) => {
                                const blockBlobClient = containerClient
                                    .getBlockBlobClient(file.filename);
                                await blockBlobClient
                                    .uploadStream(
                                        getStream(data),
                                        uploadOptions.bufferSize,
                                        uploadOptions.maxBuffers
                                    )
                            })
                })
        )
    };
    const uploadedFiles = req
        .files
        .map(file => ({
            path: file.path,
            originalName: file.originalname,
            id: file.filename
        }));
    for (const file of uploadedFiles) {
        if (
            mime.extension(file.mimetype) != 'pdf' &&
            mime.extension(file.mimetype) != 'doc' &&
            mime.extension(file.mimetype) != 'tif' &&
            mime.extension(file.mimetype) != 'tiff' &&
            mime.extension(file.mimetype) != 'jpg' &&
            mime.extension(file.mimetype) != 'jpeg' &&
            mime.extension(file.mimetype) != 'png'
        )
            return res
                .status(400)
    }
    uploadToAzureBlobStorage(uploadedFiles);
    deleteFromDisk(uploadedFiles);
    res.send({
        uploadedFiles
    });
}

module.exports = DocumentWriter;