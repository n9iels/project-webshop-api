// Create server
var restify = require('restify');
var server = restify.createServer({
    name: 'AZ Games'
});

// Allow cross-origin requests
server.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost");
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
server.use(restify.authorizationParser());
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Include endpoints
var products = require('./endpoints/products')(server);
var user     = require('./endpoints/user')(server);

// Listen to port 8080
server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});