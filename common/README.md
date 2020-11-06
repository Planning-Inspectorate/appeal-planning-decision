# Common

A package of common utilities that can be shared between all packages.

This should be required as a file dependency as will not be published to an
npm repository. To use it, add this line to your `package.json` `dependencies`
and run`npm install`.

```
"@pins/common": "file:../common",
```

## Docker

  

## Modules

Overview of available modules

### Health

This is the boilerplate for the health checks, which configures Terminus. This
will configure an endpoint on `/health` that can be called by Kubernetes etc.

The health checks take the form of an array. The function should return a simple
`Promise<boolean>` to indicate whether the resource is healthy or not. If an
error is thrown, this is treated the same way as if it returns `false`. 

```typescript
({
    server,
    tasks,
    logger,
    timeout = 1000,
    onTerminate = null,
    terminationGrace = 5000,
} : {
    server: any,
    tasks: { name: string, test: () => Promise<boolean> },
    logger,
    timeout: number,
    onTerminate: () => Promise<void> | null,
    terminationGrace: number,
}) => void {};
```

---

### Utils

#### Promise Timeout

Add a timeout to a promise

```typescript
interface promiseTimeout {
  (timeoutValueInMS: number, promise: Promise) : Promise
}
```
