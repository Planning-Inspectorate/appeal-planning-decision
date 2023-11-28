# API Spec

Our API specifications are documented using an [OpenAPI Spec](https://swagger.io/specification/). We use `swagger-jsdoc` to generate the final spec from source code comments and yaml files; this is generated when the app starts.

Use a `.yaml` file for shared components, and put an `@openapi` comment on each route. See [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc/) for more information.
