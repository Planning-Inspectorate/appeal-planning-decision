# Directory Router

This module enables the creation of express routes following the structure of a project's directories. This reduces the development overhead associated with creating new routes and encourages code to be grouped by feature rather than by type. 

## Quickstart

At the root of your application
**app.js**
```js
// create an express app
const app = express()

// pass the app to attach the routes in './routes'
spoolRoutes(app, path.join(__dirname, './routes'))

app.listen(3000, () => console.log('🚀 Site available at http://localhost:3000'))
```
>***NB:*** The routes director does **not** need to be called `routes` or be located adjacent to `app.js`, the supplied path argument just needs to be correct.

Then, in the corresponding `./routes` directory

**./routes/index.js**
```js
exports.get = (_request, response) => {
  response.send('Home Page')
}
```

**./routes/sandwiches/index.js**
```js
exports.get = (_request, response) => {
  response.send('Sandwiches')
}
```

You can now visit http://localhost:3000 to see "Home page" and http://localhost:3000/sandwiches to see "Sandwiches".

## Methods

The route builder identifies relevant exports from index files within your route directory's tree. Relevant exports are named after HTTP methods. The supported methods are `connect`, `delete`, `get`, `head`, `options`, `patch`, `post`, `put` and `trace`. A warning will be displayed at build-time for any function exported by your index whose name does not match that of a supported method. 

For example

**./routes/sandwiches/index.js**
```js
exports.post = (request, response) => {
  // ... put the sandwich in your database
  response.send('Added a new sandwich')
}

// You will be warned that this was not added to your router
exports.eatSandwich = (sandwich) => {
  sandwich.eat()
}

exports.delete = (request, response) => {
  // ... remove the sandwich from your database
  response.send('Removed a sandwich')
}
```

## Params

To add params to url paths prefix a directory name with an underscore, for example the structure

```
routes
└── sandwiches
    ├── _sandwichId
    │   ├── index.js
    │   └── ingredients
    │       ├── _ingredientId
    │       │   └── index.js
    │       └── index.js
    └── index.js
```

results in paths
```
/sandwiches
/sandwiches/:sandwichId
/sandwiches/:sandwichId/ingredients
/sandwiches/:sandwichId/ingredients/:ingredientId
```

## Middleware

To add middleware to a route export a middleware array from its index file with the structure

**./routes/sandwiches/index.js**
```js
exports.middleware = [[
  verifyUserIdentity,
  verifyLettuceIntegrity,
  ...
]]
```

>***NB:*** The array of middleware to be applied to all methods withing a route **must** be nested within another array

To apply middleware to specific methods of a route add them to an object keyed by the method name, for example

**./routes/sandwiches/index.js**
```js
exports.middleware = [[
    verifyUserIdentity, 
    verifyLettuceIntegrity, 
    ...
  ], { 
    get: [
      checkSandwichStock,
      toastIfNeeded,
      ...
    ],
    delete: [
      emailUpsetCustomers,
      ...
    ]
  }
]
```
## Spooling options

The `spoolRoutes` function accepts the following options in an object as its third argument:

* `includeRoot`
default: `false` 
Whether or not to register an `index.js` in the directory provided by the second argument. 
* `logger`
default: `pino`
A pre-configured logger instance
* `backwardsCompatibilityModeEnabled`
default: `false`
Whether or not to register V1 style routes, see [Migrating from V1](#migrating-from-v1)
* `isPathEnabled`
default: `() => true`
A function that checks if the current directory should be enabled or not, won't add the router if it returns false for that directory

## Migrating from V1

The original version of this router expected to gather instances of `express.Router` and chain them together internally. V1 routes looked like

**./routes/sandwiches/index.js**
```js
const router = express.Router();

router.get('/', (_req, res) => {
	res.send('Sandwiches')
});

router.post('/', (_req, res) => {
  // ... put the sandwich in your database
  response.send('Added a new sandwich')
});

module.exports = {
	router
};
```

With the `backwardsCompatibilityModeEnabled` option set to `true` these kinds of routes will also be added to your route tree and be interoperable with V2 routes.

V1 did not ship with a route spooling function, leaving users to implement their own. This normally looked something like

**app.js**
```js
const app = express()

const router = express.Router()

const routes = getRoutes(path.join(__dirname, './routes'))
for (const [url, handler] of Object.entries(routes)) {
	router.use(`/`, handler)
}

app.use('/', router)
```

and can be replaced with 

**app.js**
```js
const app = express()

spoolRoutes(app, path.join(__dirname, './routes'))
```

With `backwardsCompatibilityModeEnabled` set to `true` a route can be updated to V2 incrementally. The sandwiches V1 example above might first be adapted as 

**./routes/sandwiches/index.js**
```js
const router = express.Router();

const get = (_req, res) => {
	res.send('Sandwiches')
};

router.post('/', (_req, res) => {
  // ... put the sandwich in your database
  response.send('Added a new sandwich')
});

module.exports = {
  get,
	router
};
```

and then later to 

**./routes/sandwiches/index.js**
```js
exports.get = (_req, res) => {
	res.send('Sandwiches')
};

exports.post('/', (_req, res) => {
  // ... put the sandwich in your database
  response.send('Added a new sandwich')
});
```

Once all routes within a tree have been migrated the `backwardsCompatibilityModeEnabled` flag can be removed from `spoolRoutes` options.

If an exported router is found in the route tree when `backwardsCompatibilityModeEnabled` is set to false you will be warned at build-time.
