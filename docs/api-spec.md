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
