const { ObjectId } = require('mongodb');
export abstract class Model {
	constructor(public _id?: typeof ObjectId) {}
}