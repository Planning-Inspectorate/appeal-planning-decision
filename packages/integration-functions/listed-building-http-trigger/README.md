# listed-building-http-trigger

function app that can be manually triggered via an http call

- temporary solution until ODW provides a listed building topic
- requires a function key in the request
- reads a file from the function app storage account and adds each listed building as a message to the listed building queue
- file can be downloaded manually and added to the storage account
- will overwhelm the DB as there will be 100,000s of messages, so collection will need scaling before running
- will take some time and may be safer to split file into a few smaller files or bump up max function run time
- file taken from: https://www.planning.data.gov.uk/dataset/listed-building