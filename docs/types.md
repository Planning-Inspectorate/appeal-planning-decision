# Types

Though we use JavaScript, which uses [dynamic & weak typing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#dynamic_and_weak_typing), we want to be type safe to help reduce bugs. To do this we define types using [jsdoc](https://jsdoc.app/), [Prisma](https://www.prisma.io/) (for database types), and [TypeScript](https://www.typescriptlang.org/) (only type defintion files, no code).

## Prisma Types

In the `packages/appeals-service/api` package, to import Prisma types in jsdoc, use

```
import('@prisma/client').MyType
```

Types for creates or updates may not have all fields, so use the `*CreateInput` or `*UpdateInput` variations for those:

```
import('@prisma/client').Prisma.MyTypeUncheckedCreateInput
// or
import('@prisma/client').Prisma.MyTypeUncheckedUpdateInput
```

If you need a type with a relation included, say an `AppealUser` with a `SecurityToken`, you can use:

```
import('@prisma/client').Prisma.AppealUserGetPayload<{include: {SecurityToken: true}}>
```

This type will have a `.SecurityToken` property with the fields from that model.
