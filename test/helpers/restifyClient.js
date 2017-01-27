const restify      = require('restify');
const mockDatabase = require('../mocks/database');

function RestifyClient() {
    this.server = "";
};

RestifyClient.prototype.createClient = function()
{
    this.server = restify.createServer({
        name: 'AZ Games - Testing server'
    });

    this.server.use(restify.authorizationParser());
    this.server.use(restify.queryParser());
    this.server.use(restify.bodyParser());

    var products = require('../../endpoints/products')(this.server, mockDatabase);
    var user     = require('../../endpoints/user')(this.server, mockDatabase);
    var wishlist = require('../../endpoints/wishlist')(this.server, mockDatabase);
    var order    = require('../../endpoints/order')(this.server, mockDatabase);
    var admin    = require('../../endpoints/admin')(this.server, mockDatabase);

    // Start server and listen to port 8083
    this.server.listen(8083);

    // Start client to Tests
    return restify.createJsonClient({
        version: '*',
        url: 'http://127.0.0.1:8083',
    });
}

RestifyClient.prototype.destroyClient = function()
{
    this.server.close();
}

module.exports = new RestifyClient();