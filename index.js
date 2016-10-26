// Create server
var restify = require('restify');
var server = restify.createServer({
    name: 'AZ Games'
});
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Include endpoints
var products = require('./endpoints/products')(server);

// Listen to port 8080
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});