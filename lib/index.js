
const { Client } = require('elasticsearch');

module.exports = function (options, imports, register) {

    if (!options.settings) {
        return register(Error('No settings found'));
    }

    const instances = Object.keys(options.settings).reduce( (acc, name) => {
        const { connection } = options.settings[name];
        acc[name] = new Client(connection);
        return acc;
    }, {});

    register(null, {
        onDestroy: () => Object.values(instances).map((client) => client.close()),
        elasticsearch: instances
    });
};
