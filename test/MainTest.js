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
var mockery = require('mockery');
var plugin = require('../lib/index');

describe('[ARCHITECT] Elasticsearch', function () {

    before(function () {
        mockery.enable();
        mockery.registerMock('elasticsearch', {
            Client: function () {
            }
        });
    });

    after(function () {
        mockery.disable();
    });

    it('test', function () {
        plugin({settings: {
                default: {}
            }
        }, {},
        function (err, result) {
            test.assert.ifError(err);
            test.object(result.elasticsearch);
            test.object(result.elasticsearch.default);
        });
    });

});