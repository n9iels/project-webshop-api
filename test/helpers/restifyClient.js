const restify      = require('restify');
const paginate       = require('restify-paginate');

function RestifyClient() {
    this.server = "";
};

RestifyClient.prototype.createClient = function(databaseHelper, authenticationHelper)
{
    this.server = restify.createServer({
        name: 'AZ Games - Testing server'
    });

    this.server.use(restify.authorizationParser());
    this.server.use(restify.queryParser());
    this.server.use(restify.bodyParser());
    this.server.use(paginate(this.server, {hostname: false, numbersOnly: true, defaults:{page: 1,per_page: 10},}));

    var products        = require('../../endpoints/products')(this.server, databaseHelper, authenticationHelper);
    var user            = require('../../endpoints/user')(this.server, databaseHelper, authenticationHelper);
    var wishlist        = require('../../endpoints/wishlist')(this.server, databaseHelper, authenticationHelper);
    var order           = require('../../endpoints/order')(this.server, databaseHelper, authenticationHelper);
    var admin           = require('../../endpoints/admin')(this.server, databaseHelper, authenticationHelper);
    var public_wishlist = require('../../endpoints/public_wishlist')(this.server, databaseHelper, authenticationHelper);
    var favoritelist    = require('../../endpoints/favoritelist')(this.server, databaseHelper, authenticationHelper);
    var stats           = require('../../endpoints/stats')(this.server, databaseHelper, authenticationHelper);

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