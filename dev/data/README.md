# Data

This ingests test data into the development stack. Not for production use.

## Environment Variables

- **DB_TYPE**: Driver to use - defaults to `mongodb`
- **SOURCE_DIR**: Subfolder inside `/data` to user

## Folder structure

### Data

> **tl;dr** create files in the format `/data/<service>/<int>-<collection>.<js/json>`

This is where the data lives. This is logically separated by service. You
can store data either in JSON or JS format - JSON is static whereas JS can be
used if you need to link to other data or calculate things.

The file format **MUST** be `<int>-<collection>`, eg `001-user.json`. The number
is the position in which it's run (eg, `001` is run before `002`) - this allows
you to link through to data already in a data table (useful for linking foreign
keys in SQL DBs).

The `collection` name is the name of the collection/table - in the above
example, it will be called `user`.

#### JSON

This can be a simple array of objects. If you use an array of objects, it will
add a `created` and `updated` key with the datetime of when it was created.

If you wish not to have this metadata in, you can use this format:

```json
{
  "meta": {
    "created": false, // Add "created" metadata
    "updated": false // Add "updated" metadata
  },
  "data": [{...}] // Insert the data here
}
```

#### JS

You can run any NodeJS script in here. It must return an array of objects
from `module.exports` in the same format as JSON.

### Drivers

This exists to allow for future database types to be added. As an interface,
the driver must have `auth`, `close`, `insertBulk` and `truncate` methods
defined.

#### MongoDB

##### Environment Variables

- **MONGODB_URL**: The MongoDB URL, eg `mongodb://mongodb:27017/appeals-service-api`
