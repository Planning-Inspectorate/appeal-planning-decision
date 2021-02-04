# OpenFaaS-Node-Multiarch

> Forked from [MrSimonEmms/openfaas-templates](https://gitlab.com/MrSimonEmms/openfaas-templates)

A multi-arch template for running Node and TypeScript applications on
OpenFaaS

This package is purely to provide the TypeScript interfaces for use in the
functions.

## Compatibility with official Node12 template

This template is designed as a drop-in replacement for the official [Node12](https://github.com/openfaas/templates/tree/master/template/node12)
template in the OpenFaaS store. It should be considered as an improvement to
that template, offering the following:
- TypeScript support
- Multi-arch builds (can use the same template to build for your AMD64 laptop and ARM on a Raspberry Pi)
- Simplified function interface

### TypeScript Support

Interfaces are published to [npm](https://www.npmjs.com/package/openfaas-node-multiarch)
under the `openfaas-node-multiarch`package.

A `tsconfig.json` file is included for convenience. However, as TypeScript building is
handled by the Docker image, this should only be used for local running.

### Simplified Interface

In the official Node12 template, you must return `context.succeed(response)` to
send data outwards. Whilst I have no issue with that in itself, it can make testing
a little harder than it needs to be. For that reason, any value returned, resolved
or rejected from the function is treated as the response.

There are no performance differences as the methods are just syntactic sugar, allowing
personal preference to be the differentiator.

These all result in the same output:

```javascript
// Successful execution
module.exports = (event, context) => {
  context.httpHeaders = {
    'content-type': 'application/json',
  };
  context.httpStatus = 403

  return { hello: 'world' };
};

module.exports = (event, context) => context
  .headers({
    'content-type': 'application/json',
  })
  .status(403)
  .succeed({ hello: 'world' });
```

```javascript
// Failed execution
module.exports = () => {
  throw new Error('some error');
};

module.exports = (event, context) => context
  .fail(new Error('some error'));
```

## Examples

### JavaScript

This must be set to `handler.js`

```javascript
module.exports = (event, context) => {
  const response = {
    status: `Received input js: ${JSON.stringify(event.body)}`,
  };

  return context
    .status(200)
    .succeed(response);
};
```

### TypeScript

This must be set to `handler.js`

```typescript
import { IFunctionContext, IFunctionEvent } from 'openfaas-node-multiarch';

export default (event: IFunctionEvent, context: IFunctionContext) => {
  const response = {
    status: `Received input: ${JSON.stringify(event.body)}`,
  };

  return context
    .status(200)
    .succeed(response);
};
```
