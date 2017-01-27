// Import modules
var DatabaseHelper = require('./helpers/database');
var restify        = require('restify');

// Create database connection
var Database = new DatabaseHelper();

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
var products = require('./endpoints/products')(server, Database);
var user     = require('./endpoints/user')(server, Database);
var wishlist = require('./endpoints/wishlist')(server, Database);
var order    = require('./endpoints/order')(server, Database);
var admin    = require('./endpoints/admin')(server, Database);
var favoritelist = require('./endpoints/favoritelist')(server, Database); // HABBO: stuff
var stats    = require('./endpoints/stats')(server, Database);

// Start server and listen to port 8081
server.listen(8081, function() {
  console.log('%s listening at %s', server.name, server.url);
});
