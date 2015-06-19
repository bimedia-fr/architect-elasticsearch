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

describe('[ARCHITECT][ELASTICSEARCH] Documents', function () {

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
                    index: function(option, cb) {
                        cb(undefined, option);
                    },
                    update: function(option, cb) {
                        cb(undefined, option);
                    },
                    drop: function(option, cb) {
                        cb(undefined, option);
                    },
                    create: function(option, cb) {
                        cb(undefined, option);
                    },
                    get: function(option, cb) {
                        cb(undefined, option);
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
            instance.default.create({id: 74, body: {
                    foo: 'bar'
                }
            }, function(err, option) {
                test.assert.ifError(err);
                test.object(option).is({id: 74, body: {
                        foo: 'bar'
                    },
                    index: "test",
                    type: "test_type"
                });
                done();
            });
        });
        
        it('update', function(done) {
            instance.default.update({id: 74, body: {
                    foo: 'bar'
                }
            }, function(err, option) {
                test.assert.ifError(err);
                test.object(option).is({id: 74, body: {
                        foo: 'bar'
                    },
                    index: "test",
                    type: "test_type"
                });
                done();
            });
        });

        it('index', function(done) {
            instance.default.index({id: 74, body: {
                    foo: 'bar'
                }
            }, function(err, option) {
                test.assert.ifError(err);
                test.object(option).is({id: 74, body: {
                        foo: 'bar'
                    },
                    index: "test",
                    type: "test_type"
                });
                done();
            });
        });
        
        it('get', function(done) {
            instance.default.get({ id: 73 }, function(err, option) {
                test.assert.ifError(err);
                test.object(option).is({id: 73,
                    index: "test",
                    type: "test_type"
                });
                done();
            });
        });
        
        it('drop', function(done) {
            instance.default.drop({ id: 73 }, function(err, option) {
                test.assert.ifError(err);
                test.object(option).is({id: 73,
                    index: "test",
                    type: "test_type"
                });
                done();
            });
        });
    });

});