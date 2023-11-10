# document-metadata-fo-integration

function app that consumes document metadata messages from BO

- document metadata represent files attached to appeal cases
- ignore messages if not published/scanned/redacted
- currently this is assuming that all docs meeting this criteria will be publicy available and so FO can just link users to the storage account uri directly