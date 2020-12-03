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
    res
        .sendFile(
            `${directory}/${id}`
        );
}

module.exports = DocumentReader;