/**
 * Products endpoint related to products activities
 */
var Products = {};

/**
 * Products Contructor
 *
 * @method init
 * @param {Object} server    Restify Server Object
 * @param {Object} database  Database object
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
 * http://localhost:8080/products/filter?platform=PS4
 */
Products.init = function(server, database)
{
    // Endpoint for '/products/filter' to receive filtered products from the database
    server.get('products', function (req, res, next)
    {
        var base_sql = "SELECT * FROM game g INNER JOIN platform_independent_info pi ON g.pi_id = pi.pi_id WHERE 1=1";
        var query = req.query;

        for (var i in query)
        {
            if (i=="price-min")
            {
                base_sql += " AND price > " + database.escape(query[i]);
            }
            else if(i == "price-max")
            {
                base_sql += " AND price < " + database.escape(query[i]);
            }
            else
            {
                base_sql += " AND " + i + " IN(" + database.escape(query[i]) + ")"
            }
        }

        database.executeQuery(base_sql, [], function (result, error)
        {
            if (result && error == null) {
                return res.send(result);
            }

            return res.send({message:"No results!"})
          });

        next();
    });
    
    // Endpoint for '/products:id' to receive a single product
    server.get('products/:ean_number', function(req, res, next)
    {
        var query = req.query;

        database.executeQuery("SELECT * FROM game g, platform_independent_info pii WHERE g.ean_number = ? AND g.pi_id = pii.pi_id", [req.params.ean_number], function (result)
        {
            if (result.length > 0)
            {
              return res.send(result);
            }

            return res.send(404, {message:"No results!"})
        });

        next();
    });
};

module.exports = function (server, database)
{
    return Products.init(server, database);
}