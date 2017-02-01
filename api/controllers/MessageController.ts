import * as knex from 'knex';
import * as bookshelf from 'bookshelf';

export class MessageController {
    _query: knex;
    _db: bookshelf;
    table: any;
    success: Object = {};

    constructor() {
        this._query = knex({
          client: 'mysql',
            connection: {
                host: '178.62.90.186',
                user: 'michael',
                password: 'Highland100?',
                database: 'jetchat'
            }
        });

        this._db = bookshelf(this._query);

        this.table = this._db.Model.extend({
            tableName: 'message'
        })
    }

    create(data: Object, response: any, ioCall: Boolean) { 
        return new this.table(data).save().then((model: any) => {
            var attribs = model.attributes;

            if(typeof ioCall === "boolean" && ioCall === true) {
                response(attribs);
            } else {
                response.end(JSON.stringify(attribs, undefined, 2), 'utf-8');
            }
        });
    }
    read(data: Object, response: any, ioCall: Boolean) { 
        return this.table.where(data).fetchAll().then((item: any) => {
            if(typeof ioCall === "boolean" && ioCall === true) {
                response(item.toJSON());
            } else {
                response.end(JSON.stringify(item.toJSON(), undefined, 2), 'utf-8');
            }
        });
    }

    including(data: any, response: any, ioCall: Boolean) {
        return this.table.query({where: { from: data.id }, orWhere: { to: data.id }}).fetchAll().then((item: any) => {
            response.end(JSON.stringify(item.toJSON(), undefined, 2), 'utf-8');
        });
    }

    destroy(data: Object) { return new this.table(data).destroy(); }
}