/*jslint node : true, nomen: true, plusplus: true, vars: true, eqeq: true,*/
/* 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

var ElasticSearch = require('elasticsearch');
var _ = require('lodash');

module.exports = function setup(options, imports, register) {
    
    if (!options || !options.settings || options.settings.length === 0) {
        register(new Error("No settings found"));
    } else {
        var instances = Object.keys(options.settings).reduce(function (prev, curr) {
            var opt = options.settings[curr];
            var client;
            if (imports.mock) {
                client = imports.mock;
            } else {
                var connection = opt.connection || {};
                client = new ElasticSearch.Client({host: (connection.host || 'localhost') + ':' + (connection.port || 9200)});
            }
            
            prev[curr] = {
                documents: {
                    index: function (command, callback) {
                        client.index(_.merge({}, opt.database, command), callback);
                    },
                    delete: function (command, callback) {
                        client.delete(_.merge({}, opt.database, command), callback);
                    },
                    get: function (command, callback) {
                        client.get(_.merge({}, opt.database, command), callback);
                    },
                    create: function (command, callback) {
                        client.create(_.merge({}, opt.database, command), callback);
                    },
                    update: function (command, callback) {
                        client.update(_.merge({}, opt.database, command), callback);
                    }
                },
                indexes: {
                    create: function (mapping, callback) {
                        client.indices.create({index: opt.database.index}, function(err) {
                            if(err) {
                                callback(err);
                            } else {
                                client.indices.putMapping({
                                    index: opt.database.index,
                                    body: mapping
                                }, callback);
                            }
                        });
                    },
                    delete: function (callback) {
                        client.indices.delete({index: opt.database.index}, callback);
                    }
                }
            };
            return prev;
        }, {});
        
       
        register(null, {
            onDestruct: function (callback) {
                instances.forEach(function(instance) {
                    instance.close();
                });
                callback();
            },
            elasticsearch: instances
        });
    }
};
