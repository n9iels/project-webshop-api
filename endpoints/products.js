var Authenticate   = require('../helpers/authenticate');
var DatabaseHelper = require('../helpers/database');
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

/**
 * STEP 1: Dingen wijzigen en opslaan
 * STEP 2: Ga naar command line
 * STEP 3: Ctrl + C om huidige proces af te sluiten
 * STEP 4: Voer node index.js in als commando (of druk pijl omhoog om meest recente commando te krijgen en voer deze uit)
 * STEP 5: Ga naar Chrome browser en voer localhost:8080/(naam van endpoint) (BIJVOORBEELD localhost:8080/products)
 * 
 * VOORBEELD QUERY: http://localhost:8080/products?genre=actie&price=50-90&name=battlefield
 * VOORBEELD QUERY 2: http://localhost:8080/products
 */
Products.init = function(server)
{
    // Endpoint for '/products' to receive all products in the database
    server.get('products', function (req, res, next)
    {
        var query = req.query;

        Database.executeQuery("SELECT * FROM game", [], function (result)
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