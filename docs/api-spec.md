# API Spec

Our API specifications are documented using an [OpenAPI Spec](https://swagger.io/specification/). We use `swagger-jsdoc` to generate the final spec from source code comments and yaml files; this is generated when the app starts.

Use a `.yaml` file for shared components, and an `*.spec.yaml` file with `path` definitions on each router file. See [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc/) for more information.

e.g.

```
// contains the router code
appeals.js
// contains the route/path specifications
appeals.spec.yaml
```

## Types

To use the API types from another package, use `import` like this:

API response type

```
/**
 * @typedef {import('appeals-service-api').Api.AppealCase} AppealCase
 */
```

DB schema type

```
/**
 * @typedef {import('appeals-service-api').Schema.AppealUser} AppealUser
 */
```

### Updates

When updating the API spec, generate the corresponding types with:

`packages/appeals-service-api> npm run gen-api-types`

which will update `packages/appeals-service-api/src/spec/api-types.d.ts`
