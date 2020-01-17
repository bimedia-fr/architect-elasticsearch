
const { Client } = require('@elastic/elasticsearch');

module.exports = function (options, imports, register) {

    if (!options.settings) {
        return register(Error('No settings found'));
    }

    const instances = Object.keys(options.settings).reduce( (acc, name) => {
        const connection = options.settings[name];
        const client = acc[name] = new Client(connection);
        client.docs = 'index delete get search create update bulk'.split(' ').reduce((docs, func) => {
            docs[func] = (params, options) => client[func]({ ...params, index: name }, options);
            return docs;
        }, {});
        return acc;
    }, {});

    register(null, {
        onDestroy: () => Object.values(instances).map((client) => client.close()),
        elasticsearch: instances
    });
};
