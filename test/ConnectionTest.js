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
var test = require('unit.js');
var plugin = require('../lib/index');

describe('[ARCHITECT][ELASTICSEARCH] Connection', function () {

    it('without settings', function (done) {
        plugin({}, {
            mock: {
                Client: function () {
                    return { };
                }
            }
        },
        function (err, result) {
            test.object(err).is(new Error('No settings found'));
            test.undefined(result);
            done();
        });
    });

    it('with default connection', function (done) {
        plugin({settings: {
            default: {
                database: {
                    index: 'test',
                    type: 'test_type'
                }
            }
        }
        }, {
            mock: {
                Client: function () {
                    return { };
                }
            }
        },
        function (err, result) {
            test.assert.ifError(err);
            test.object(result.elasticsearch);
            test.object(result.elasticsearch.default);
            done();
        });
    });

    it('with settings', function (done) {
        plugin({settings: {
            default: {
                connection: {
                    host: 'localhost',
                    port: 9200
                },
                database: {
                    index: 'test',
                    type: 'test_type'
                }
            }
        }
        }, {
            mock: {
                Client: function () {
                    return { };
                }
            }
        },
        function (err, result) {
            test.assert.ifError(err);
            test.object(result.elasticsearch);
            test.object(result.elasticsearch.default);
            done();
        });
    });

});
