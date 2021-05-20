const NodeClam = require('clamscan');
const config = require('../../config');
const validateFileSize = require('../custom/file-size');
const validMimeType = require('../custom/mime-type');
const validBinaryMimeType = require('../custom/mime-binary-type');
const {
  MIME_TYPE_DOC,
  MIME_BINARY_TYPE_DOC,
  MIME_TYPE_DOCX,
  MIME_TYPE_PDF,
  MIME_TYPE_JPEG,
  MIME_TYPE_TIF,
  MIME_TYPE_PNG,
} = require('../../lib/mime-types');

module.exports = {
  'application-upload': {
    custom: {
      options: async (value, { req, path }) => {
        const { appeal } = req.session;

        const noFilePreviouslyUploaded =
          !appeal || !appeal.requiredDocumentsSection.originalApplication.uploadedFile.id;

        const noNewFileUploaded =
          !req.files || Object.keys(req.files).length === 0 || !req.files[path];

        if (noFilePreviouslyUploaded) {
          if (noNewFileUploaded) {
            throw new Error('Select a planning application form');
          }
        } else if (noNewFileUploaded) {
          return true;
        }

        // check file extension type
        const { mimetype } = req.files[path];

        validMimeType(
          mimetype,
          [
            MIME_TYPE_DOC,
            MIME_TYPE_DOCX,
            MIME_TYPE_PDF,
            MIME_TYPE_JPEG,
            MIME_TYPE_TIF,
            MIME_TYPE_PNG,
          ],
          'Doc is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
        );

        // check binary mime type of file
        await validBinaryMimeType(
          req.files['application-upload'],
          [
            MIME_BINARY_TYPE_DOC,
            MIME_TYPE_DOCX,
            MIME_TYPE_PDF,
            MIME_TYPE_TIF,
            MIME_TYPE_JPEG,
            MIME_TYPE_PNG,
          ],
          'Doc is is the wrong file type: The file must be a DOC, DOCX, PDF, TIF, JPG or PNG'
        );

        const ClamScan = new NodeClam().init({
          remove_infected: false, // If true, removes infected files
          quarantine_infected: false, // False: Don't quarantine, Path: Moves files to this place.
          scan_log: null, // Path to a writeable log file to write scan results into
          debug_mode: false, // Whether or not to log info/debug/error msgs to the console
          file_list: null, // path to file containing list of files to scan (for scan_files method)
          scan_recursively: true, // If true, deep scan folders recursively
          clamscan: {
            path: '/usr/local/var/homebrew/linked/clamav/bin', // Path to clamscan binary on your server
            db: null, // Path to a custom virus definition database
            scan_archives: true, // If true, scan archives (ex. zip, rar, tar, dmg, iso, etc...)
            active: true, // If true, this module will consider using the clamscan binary
          },
          clamdscan: {
            socket: false, // Socket file for connecting via TCP
            host: false, // IP of host to connect to TCP interface
            port: false, // Port of host to use when connecting via TCP interface
            timeout: 60000, // Timeout for scanning files
            local_fallback: false, // Do no fail over to binary-method of scanning
            path: '/usr/local/var/homebrew/linked/clamav/bin', // Path to the clamdscan binary on your server
            config_file: null, // Specify config file if it's in an unusual place
            multiscan: true, // Scan using all available cores! Yay!
            reload_db: false, // If true, will re-load the DB on every call (slow)
            active: true, // If true, this module will consider using the clamdscan binary
            bypass_test: false, // Check to see if socket is available when applicable
          },
          preference: 'clamdscan', // If clamdscan is found and active, it will be used by default
        });

        ClamScan.then(async (clamscan) => {
          // You can re-use the `clamscan` object as many times as you want
          const version = await clamscan.get_version();
          console.log(`ClamAV Version: ${version}`);

          const { is_infected, file, viruses } = await clamscan.is_infected('/some/file.zip');
          if (is_infected) console.log(`${file} is infected with ${viruses}!`);
        });

        // check file size
        const { size } = req.files[path];

        validateFileSize(size, config.fileUpload.pins.uploadApplicationMaxFileSize);

        return true;
      },
    },
  },
};
