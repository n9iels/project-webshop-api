// Import modules
var databaseHelper     = new (require('./helpers/database'));
var jwtHelper          = require('./helpers/jwt')(require('crypto'), require('base64url'));
var authenticateHelper = require('./helpers/authenticateHelper')(databaseHelper, jwtHelper, require('bcrypt-nodejs'));
var restify            = require('restify');

// Create server
var server = restify.createServer({
    name: 'AZ Games'
});

// Configure restify
restify.CORS.ALLOW_HEADERS.push('authorization');
server.pre(restify.CORS());
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Include endpoints

var products        = require('./endpoints/products')(server, databaseHelper, authenticateHelper);
var user            = require('./endpoints/user')(server, databaseHelper, authenticateHelper);
var wishlist        = require('./endpoints/wishlist')(server, databaseHelper, authenticateHelper);
var order           = require('./endpoints/order')(server, databaseHelper, authenticateHelper);
var admin           = require('./endpoints/admin')(server, databaseHelper, authenticateHelper);
var public_wishlist = require('./endpoints/public_wishlist')(server, databaseHelper, authenticateHelper);
var favoritelist    = require('./endpoints/favoritelist')(server, databaseHelper, authenticateHelper);
var stats           = require('./endpoints/stats')(server, databaseHelper, authenticateHelper);

// Start server and listen to port 8081
server.listen(8081, function() {
  console.log('%s listening at %s', server.name, server.url);
});
