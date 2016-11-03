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

// Start server and listen to port 8080
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});