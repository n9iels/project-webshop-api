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
        var query = req.query;

        var ean_number = query.ean_number; // game ean_number

        var platform = query.platform;     // game platform
        var release_date = query.release_date;     // game release date
        var pegi_age = query.pegi_age;     // game pegi age
        var stock = query.stock;     // game stock
        var price1 = query.price1;        // game price 1
        var price2 = query.price2;        // game price 2

        var g_pi_id = query.g_pi_id;     // game platform independent id
        var pi_pi_id = query.pi_pi_id;     // platform independent id

        var publisher = query.publisher;     // platform independent info publisher
        var title = query.title;     // platform independent info title
        var subtitle = query.subtitle;     // platform independent info subtitle
        var genre = query.genre;     // platform independent info genre
        var franchise = query.franchise;     // platform independent info franchise
        var description = query.description;     // platform independent info description

        var base_sql = "SELECT * FROM game g INNER JOIN platform_independent_info pi ON g.pi_id = pi.pi_id WHERE 1=1 ";
        
        if (ean_number != null && ean_number != "") { base_sql += "AND ean_number = " + ean_number + " "; }

        if (platform != null && platform != "") { base_sql += "AND platform = " + database.escape(platform) + " "; }
        if (release_date != null && release_date != "") { base_sql += "AND release_date = " + database.escape(release_date) + " "; }
        if (pegi_age != null && pegi_age != "") { base_sql += "AND pegi_age = " + database.escape(pegi_age) + " "; }
        if (stock != null && stock != "") { base_sql += "AND stock = " + database.escape(stock) + " "; }
        if (price1 != null && price2 != null && price1 != "" && price2 != "") { database.escape(base_sql) += "AND price BETWEEN " + database.escape(price1) + " AND " + database.escape(price2) + " "; }

        if (publisher != null && publisher != "") { base_sql += "AND publisher = " + database.escape(publisher) + " "; }
        if (title != null && title != "") { base_sql += "AND title = " + database.escape(title) + " "; }
        if (subtitle != null && subtitle != "") { base_sql += "AND subtitle = " + database.escape(subtitle) + " "; }
        if (genre != null && genre != "") { base_sql += "AND genre = " + database.escape(genre) + " "; }
        if (franchise != null && franchise != "") { base_sql += "AND franchise = " + database.escape(franchise) + " "; }
        if (description != null && description != "") { base_sql += "AND description = " + database.escape(description) + " "; }

        database.executeQuery(base_sql, [], function (result)
          {
            if (result) {
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