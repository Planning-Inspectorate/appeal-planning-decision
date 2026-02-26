# BOPS (Back Office Planning System)

BOPS is an api for looking up planning applications made to an LPA

It has public and private endpoints, currently we are only using the public endpoint

There is a confluence space here:
https://pins-ds.atlassian.net/wiki/spaces/AAD/pages/2491482231/Overview

The current process is:

- for planning appeals
- ask user for the planning application number in before you start
- if found and it's for an appeal type we support, map what data we can from the planning application into the appeal
- skip these questions from the navigation
- allow users to check the info and change answers
- allow users to continue without a successful lookup

There are examples/the api schema in `/packages/common/src/client/bops/examples`, although the staging site may have more recent changes: `https://camden.bops-staging.services/api/docs/index.html?urls.primaryName=API%20V2%20Docs` (You seem to need to refresh the page for it to load)

When moving through before you start, you can skip the planning application lookup, use a random one ( in which case it should show a not found page with the option to continue), find a valid example in the BOPS staging environment, or use an example lookup that fakes the response by using one of the below:

- `HH-GRANTED`
- `HH-REFUSED`
- `HH-NODECISION`

You can turn off the feature locally with the feature flag `LOCAL_FEATURE_FLAG_ENABLE_APPLICATION_API_LOOKUP` set to false. This is available in order to turn off without needing to turn off `FEATURE_FLAGS_SETTING: ALL_ON`

Depending on your local networking setup you may need to allow the external network request:
PINS users can add the their internal CA cert as a file named `ExtraCA.crt` to the root of the project, this filename is git-ignored

In future we will need to:

- map more data, appeal types + fields + documents
- handle lpas, as domain includes the lpa name
- potentially use a private endpoint and handle API secrets securely in Azure Key Vault
