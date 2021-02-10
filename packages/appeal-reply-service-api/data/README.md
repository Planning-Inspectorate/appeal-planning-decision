# Data

This is for static data that is ingested from third-party sources. It could be
data that is stored in a database in the future, but is stored as static files
for purposes of expediency, ease etc.

There should be a limit on the size of the data (suggest 100KB) - any data
that's bigger than that should be stored in a database.

All data **MUST** be treated as readonly. There are no exceptions to this
rule.

In production, this data will likely be replaced by either a mounted volume
or a ConfigMap to avoid coupling the data to a release number. This will
enable the data to be automatically updated from the third-party seamlessly.
