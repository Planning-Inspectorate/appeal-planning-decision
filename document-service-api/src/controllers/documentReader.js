const {
    documentStorage: {
        documentStorage: {
            directory
        }
    }
} = require('../lib/config');
const DocumentReader = (req, res) => {
    const {
        id
    } = req.params;
    // TO-DO: reading from azure blob storage
    res
        .sendFile(
            `${directory}/${id}`
        );
}

module.exports = DocumentReader;