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

var ElasticSearch = require('@elastic/elasticsearch');

module.exports = function setup(options, imports, register) {

    var instances, connection;

    if (!options || !options.settings || options.settings.length === 0) {
        register(new Error('No settings found'));
    } else {
        instances = Object.keys(options.settings).reduce(function (prev, curr) {
            var opt = options.settings[curr];
            var client;
            if (imports.mock) {
                client = imports.mock;
            } else {
                connection = opt.connection || {};
                client = new ElasticSearch.Client(connection);
            }

            prev[curr] = {
                close: function () {
                    client.close();
                },
                indexes: {
                    create: function (mapping, callback) {
                        client.indices.create(opt.database, function (err) {
                            if (err) {
                                callback(err);
                            } else {
                                client.indices.putMapping(Object.assign({}, {
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
                prev2[curr2] = function (command, callback) {
                    client[curr2](Object.assign({}, opt.database, command), callback);
                };
                return prev2;
            }, {});

            return prev;
        }, {});

        register(null, {
            onDestroy: function () {
                Object.keys(instances).forEach(function (key) {
                    if (typeof instances[key] === 'object') {
                        instances[key].close();
                    }
                });
            },
            elasticsearch: instances
        });
    }
};
