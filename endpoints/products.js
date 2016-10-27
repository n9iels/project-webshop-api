var Authenticate   = require('../helpers/authenticate');
var DatabaseHelper =  require('../helpers/database');
var Database       = new DatabaseHelper();
var Products       = {};

/**
 * Products Contructor
 *
 * @method init
 * @param {Object} server  Restify Server Object
 *
 * @return {void}
 */
Products.init = function(server)
{
    // Endpoint for '/products' to receive all products in the database
    server.get('products', function (req, res, next)
    {
        var query = req.query;

        Database.executeQuery("SELECT * FROM User", [], function (result)
        {
            if (result)
            {
                return res.send(result)
            }

            return res.send({message:"No results!"})
        });

        next();
    });
    
    // Endpoint for '/products:id' to receive a single product
    server.get('products/:id', function(req, res, next)
    {
        res.send("Product with id " + req.params.id);
        next();
    });
};

module.exports = function (server)
{
    return Products.init(server);
}