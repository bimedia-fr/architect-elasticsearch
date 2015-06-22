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
                close: function() {
                    client.close();
                },
                indexes: {
                    create: function (mapping, callback) {
                        client.indices.create(opt.database, function(err) {
                            if(err) {
                                callback(err);
                            } else {
                                client.indices.putMapping(_.merge({}, {
                                    body: mapping
                                }, opt.database), callback);
                            }
                        });
                    },
                    delete: function (callback) {
                        client.indices.delete({index: opt.database.index}, callback);
                    }
                }
            };
            
            
            prev[curr].documents = ['index', 'delete', 'get', 'search', 'create', 'update'].reduce(function (prev2, curr2) {
                prev2[curr2] = function(command, callback) {
                    client[curr2](_.merge({}, opt.database, command), callback);
                };
                return prev2;
            }, {});
            
            return prev;
        }, {});
            
        register(null, {
            onDestroy: function () {
                Object.keys(instances).forEach(function(key) {
                    if(typeof instances[key] === 'object') {
                        instances[key].close();
                    }
                });
            },
            elasticsearch: instances
        });
    }
};
