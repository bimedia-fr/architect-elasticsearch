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
'use strict';

var test = require('unit.js');
var plugin = require('../lib/index');

describe('[ARCHITECT][ELASTICSEARCH] Indexes', function () {

    describe('with valid settings', function () {
        var instance;

        before(function (done) {
            plugin({settings: {
                    default: {
                        connection: {
                            host: 'hostlocal',
                            port: 8585
                        },
                        database: {
                            index: 'test',
                            type: 'test_type'
                        }
                    }
                }
            }, {
                mock: {
                    indices: {
                        create: function(option, cb) {
                            cb(undefined, option);
                        },
                        putMapping: function(options, cb) {
                            cb(undefined, options);
                        },
                        delete: function(option, cb) {
                            cb(undefined, option);
                        }
                    }
                }
            },
            function (err, result) {
                test.assert.ifError(err);
                test.object(result.elasticsearch);
                test.object(result.elasticsearch.default);
                instance = result.elasticsearch;
                done();
            });
        });
        
        it('create', function(done) {
            instance.default.indexes.create({foo: "bar"}, function(err, option) {
                test.assert.ifError(err);
                test.object(option).is({
                    index: "test",
                    body: {
                        foo: "bar"
                    }
                });
                done();
            });
        });
        
        it('drop', function(done) {
            instance.default.indexes.delete(function(err) {
                test.assert.ifError(err);
                done();
            });
        });
    });
});