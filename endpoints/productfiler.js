var Authenticate   = require('../helpers/authenticate');
var DatabaseHelper = require('../helpers/database');
var Database       = new DatabaseHelper();
var Products       = {};

Products.init = function(server)
{
    // Endpoint for '/products/filter' to receive filtered products from the database
    server.get('products/filter', function (req, res, next)
    {
        var query = req.query;

        var ean_number = query.ean_number; // game ean_number

        var platform = query.platform;     // game platform
        var release_date = query.release_date;     // game release date
        var pegi_age = query.pegi_age;     // game pegi age
        var stock = query.platform;     // game stock
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
        
        if (ean_number != null) { base_sql += "AND ean_number = " + ean_number + " "; }

        if (platform != null) { base_sql += "AND platform = " + platform + " "; }
        if (release_date != null) { base_sql += "AND release_date = " + release_date + " "; }
        if (pegi_age != null) { base_sql += "AND pegi_age = " + pegi_age + " "; }
        if (stock != null) { base_sql += "AND stock = " + stock + " "; }
        if (price1 != null && price2 != null) { base_sql += "AND price BETWEEN " + price1 + " AND " + price2 + " "; }

        if (publisher != null) { base_sql += "AND publisher = " + publisher + " "; }
        if (title != null) { base_sql += "AND title = " + title + " "; }
        if (subtitle != null) { base_sql += "AND subtitle = " + subtitle + " "; }
        if (genre != null) { base_sql += "AND genre = " + genre + " "; }
        if (franchise != null) { base_sql += "AND franchise = " + franchise + " "; }
        if (description != null) { base_sql += "AND description = " + description + " "; }

        Database.executeQuery(sql, [], function (result)
          {
            if (result) {
                return res.send(result);
            }

            return res.send({message:"No results!"})
          });
        next();
    });
};

module.exports = function (server)
{
    return Products.init(server);
}



