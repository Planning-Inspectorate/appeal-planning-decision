# Data Models

In Appeals FO we have multiple models or entities. Some comply with the PINS [data model](https://github.com/Planning-Inspectorate/data-model), others are for FO use only. There are a number of conventions it is helpful to be aware of:

**Submissions**

Submissions, such as appeal submissions, are authored in the Front Office by our users. We _submit_ them to the back office. This includes appeals, LPA questionnaires, and others. We own this data, and this data is only useful until it is submitted - once submitted we no longer show them to users, after that the back office version is the source of truth.

> Note: currently appeal submissions are saved in Cosmos, and the collection is simply `appeals`. These will get migrated to SQL, and the model will likely be `AppealSubmission`

**Cases**

Appeals start life in the front office as submissions, once received by the Back Office, it is an appeal case. We receive these from back office over service bus, and save them in the `AppealCase` table, along with associated data.
