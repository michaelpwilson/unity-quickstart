import * as knex      from 'knex';
import * as bookshelf from 'bookshelf';
import * as jwt       from 'jsonwebtoken';
import { Promise }	  from 'bluebird';
import * as bcrypt	  from 'bcryptjs';

export class UserController {
    _query: knex;
    _db: bookshelf;
    _io: any;
    table: any;

    constructor(io: any) {
        let _self = this;

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
            tableName: 'user'
        }, {
            login: function(email, password, location, after) {
                if (!email || !password) throw new Error('Email and password are both required');

                return new this({email: email.toLowerCase().trim()}).fetch({require: true}).tap(function(customer) {
                    return bcrypt.compare(password, customer.get('password'), function(err, res) {
                        if(!res) {
                            after(res);
                        } else {
							new _self.table({id: customer.get('id') }).save({
								location: location
							}).then(function(user) {
								customer.location = location;
                            	after(customer);
                        	});
                        }
                    });
                });
            }
        });

        this._io = io;
    }

    getFriends(data: any, response: any) {
	    return this.table.where('id', 'in', JSON.parse(data.friends)).fetch().then((item: any) => {
	    	var friend = item.toJSON();

	    	if(Array.isArray(friend)) {
	    		response.end(JSON.stringify(friend, undefined, 2), 'utf-8');
	    	} else {
	    		friend.photos = friend.photos.split(",");

	    		response.end(JSON.stringify([friend], undefined, 2), 'utf-8');
	    	}
	        
	    });
    }

    login(data: any, response: any) {
		this.table.login(data.email, data.password, data.location, (res) => {
            response.end(JSON.stringify({
                result: res,
                token: jwt.sign(data.email, "secret")
            }, undefined, 2), 'utf-8'); 
        });
    }
    create(data: any, response: any) {
        let _self = this;

        data.password = bcrypt.hashSync("Highland100", bcrypt.genSaltSync(10));

        data.photos = data.photos.toString();
        data.location = data.location.toString();
        data.rooms = data.rooms.toString();

        return new this.table(data).save().then((model: any) => {
            var attribs = model.attributes;

            attribs.token = jwt.sign(attribs, "secret");
            response.end(JSON.stringify(attribs, undefined, 2), 'utf-8');
        });
    }
    read(data: Object, response: any) { 
        if(Object.keys(data).length === 0) {
            return this.table.fetchAll(data).then((item: any) => {
            	var parsed = item.toJSON();

            	for (var i = item.length - 1; i >= 0; i--) {
            		parsed[i].photos = parsed[i].photos.split(",");
            	}

                response.end(JSON.stringify(parsed, undefined, 2), 'utf-8');
            });
        } else {
            return this.table.where(data).fetch().then((item: any) => {
                //item.token = jwt.sign(item, "secret");
                response.end(JSON.stringify(item, undefined, 2), 'utf-8');
            });
        }
    }
    update(where: any, fields: any, response: any) {
        let _self = this;

        this.table.where(where).fetch().then((item: any) => {
        	if(item) {
        		var save = {};

        		item = item.toJSON();

        		if(fields.room) {
	        		if(fields.room === "[]") {
	        			item.rooms = "";
	        		} else {
	        			if(item.rooms.length === 0) {
	        				item.rooms = fields.room;
	        			} else {
	        				item.rooms = item.rooms.split(",");
			        		item.rooms.push(fields.room);
			        		item.rooms = item.rooms.toString();
	        			}
	        		}
	        		save = { rooms: item.rooms };
        		} else if(fields.friend) {
	        		if(fields.friend === "[]") {
	        			item.friends = "";
	        		} else {
	        			if(item.friends.length === 0) {
	        				item.friends = fields.friend;
	        			} else {
	        				item.friends = item.friends.split(",");
			        		item.friends.push(fields.friend);
			        		item.friends = item.friends.toString();
	        			}
	        		}	
	        		save = { friends: item.friends };	
        		}

				return new this.table(where).save(save).then(function(user) {
				    response.end(JSON.stringify(user.toJSON(), undefined, 2), 'utf-8');
				});
        	} else {
	            response.end(JSON.stringify(null, undefined, 2), 'utf-8');
        	}
        });

    }
    destroy(data: Object, response: any) {
        return new this.table(data).destroy().then((model: any) => {
            response.end(JSON.stringify({test: "hello"}, undefined, 2), 'utf-8');
        })
    }
}