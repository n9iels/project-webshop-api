var Authenticate = require('../helpers/authenticate');
var Products = {};

Products.init = function(server)
{
    // Endpoint for '/hello'
    server.get('/hello', function (req, res, next)
    {
        res.send("Boe");
        next();
    });

    server.post('/hello', Authenticate.check, function (req, res, next)
    {
        console.log("The request body is " + req.body);
        res.send("New product added");
        next();
    });
};

module.exports = function (server)
{
    return Products.init(server);
}