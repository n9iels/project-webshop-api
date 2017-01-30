var paginate = require('restify-paginate');

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
Products.init = function(server, database, Authenticate)
{
    // Endpoint for '/products/filter' to receive filtered products from the database
    server.get('products', function (req, res, next)
    {
        var base_sql = "SELECT *, (SELECT count(*) FROM game) AS total FROM game g INNER JOIN platform_independent_info pi ON g.pi_id = pi.pi_id WHERE 1=1";
        var query = req.query;

        for (var i in query)
        {
            if (i == "page" || i == "per_page")
            {
                continue;
            }

            if (i == "price-min" && query[i].length != 0)
            {
                base_sql += " AND price >= " + database.escape(query[i]);
            }
            else if(i == "price-max" && query[i].length != 0)
            {
                base_sql += " AND price <= " + database.escape(query[i]);
            }
            else if (i.length && query[i].length != 0)
            {
                base_sql += " AND " + i + " IN(" + database.escape(query[i]) + ")"
            }
        }

        // Add pagination
        base_sql += ' LIMIT ' + req.query.per_page + ' OFFSET ' + ((req.paginate.page - 1) * req.paginate.per_page);

        database.executeQuery(base_sql, [], function (result, error)
        {
            if (error)
            {
                res.send(500, error)
            }
            else if (result.length > 1)
            {
                res.paginate.send(result, result[0].total);
            }
            else
            {
                res.send({message:"No results!"})
            }
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

    // Endpoint for '/products' to add new products
    server.post("products", Authenticate.admin, function(req, res, next)
    {
        database.executeQuery("INSERT INTO game SET ?", [req.body], function(result, error)
        {
            if (error)
            {
                res.send(500, error);
            }
            else
            {
                res.send("New product add");
            }
        })
    });

    // Endpiont to edit a product
    server.patch("product/:ean_number", Authenticate.admin, function(req, res, next)
    {
        database.executeQuery("UPDATE game WHERE ean_number = ? SET ?", [req.params.ean_number, req.body], function(result, error) 
        {
            if (error)
            {
                res.send(200, error);
            }
            else
            {
                res.send("Product updated");
            }
        });
    });

    server.del("product/:ean_number", Authenticate.admin, function(req, res, next)
    {
        database.executeQuery("DELETE FROM game WHERE ean_number = ?", [req.params.ean_number], function(result, error)
        {
            if (error)
            {
                res.send(200, error);
            }
            else
            {
                res.send("product deleted");
            }
        })   
    })
};

module.exports = function (server, databaseHelper, authenticateHelper)
{
    return Products.init(server, databaseHelper, authenticateHelper);
}