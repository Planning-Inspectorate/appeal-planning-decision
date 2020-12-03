const {
    AZURE_BLOB_STORAGE_CONNECTION_STRING 
} = require('../lib/config');
const {
    BlobServiceClient,
} = require('@azure/storage-blob');
const getStream = require('into-stream');
const fs = require('fs');

const ONE_MEGABYTE = 1024 * 1024;
const uploadOptions = {
    bufferSize: 4 * ONE_MEGABYTE,
    maxBuffers: 20
};
const containerName = `documentservice`;
const client = BlobServiceClient
    .fromConnectionString(AZURE_BLOB_STORAGE_CONNECTION_STRING);
const containerClient = client
    .getContainerClient(containerName);
await containerClient.create();

const DocumentWriter = (req, res) => {
    const deleteFromDisk = async files => {
        await Promise.all(
            files
                .map(async file => {
                    fs.unlink(file.path, (err) => {})
                })
        )
    };
    const uploadToAzureBlobStorage = async files => {
        await Promise.all(
            files
                .map(async file => {
                    const blockBlobClient = containerClient
                        .getBlockBlobClient(file.filename);
                    await blockBlobClient
                        .uploadStream(
                            getStream(file.buffer),
                            uploadOptions.bufferSize,
                            uploadOptions.maxBuffers,
                            {
                                blobHTTPHeaders:
                                {
                                    blobContentType: file.mimetype
                                }
                            }
                        )
                })
        )
    };
    const uploadedFiles = req
        .files
        .map(file => ({
            path: file.path,
            buffer: file.buffer,
            mimetype: file.mimetype,
            originalName: file.originalname,
            id: file.filename
        }));
    uploadToAzureBlobStorage(uploadedFiles);
    deleteFromDisk(uploadedFiles);
    res.send({
        uploadedFiles
    });
}

module.exports = DocumentWriter;