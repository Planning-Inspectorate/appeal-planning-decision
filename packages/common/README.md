# Common

A package of common utilities that can be shared between all packages.

This should be required as a file dependency as will not be published to an
npm repository. To use it, add this line to your `package.json` `dependencies`
and run`npm install`.

```
"@pins/common": "^0.0.0",
```

## Engineering Backlog

1. Move `lib/documentTypes.js` behind a `GET` request in the Documents API: this improves cohesion for the domain concept, and
updates will be immediate for all consumers of the API.
1. Remove this package: the code within could be placed in something like a Cookiecutter template to enable 
"Golden path" development. Each project should own its own version of the code here too since changes to this
code requires coordination any way, and its preferable to allow each team to change at their own pace.

## Docker

## Modules

Overview of available modules

### Utils

#### Promise Timeout

Add a timeout to a promise

```typescript
interface promiseTimeout {
	(timeoutValueInMS: number, promise: Promise): Promise;
}
```