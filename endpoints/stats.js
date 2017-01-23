var Authenticate = require('../helpers/authenticate');

var Stats = {} 
 
Stats.init = function(server, database) 
{
    // Endpoint for '/stats' to get info of users 
    server.get('stats', Authenticate.admin, function (req, res, next) // NOTICE: 'stats/:month'
    { 
        // var query = "SELECT DISTINCT pii.title, pii.subtitle, g.platform\
        //              FROM orders_contain_games ocg JOIN `order` o ON ocg.user_id = o.user_id JOIN game g ON ocg.ean_number = g.ean_number JOIN platform_independent_info pii on g.pi_id = pii.pi_id\
        //              WHERE STATUS !=  'cart'"


        var query = 
       "SET @prev_value = NULL;\
        SET @rank_count = 0;\
        SELECT * FROM\
        (\
            SELECT ocgt.ean_number, super_amount, CASE\
                WHEN @prev_value = super_amount THEN @rank_count\
                WHEN @prev_value := super_amount THEN @rank_count := @rank_count + 1\
                END AS rank\
            FROM (\
                    SELECT ocg.ean_number, sum(amount) as super_amount\
                    FROM orders_contain_games ocg\
                    GROUP BY ocg.ean_number\
                ORDER BY super_amount DESC\
                ) as ocgt\
        ) as ranked\
        WHERE ranked.rank <= 10"

        database.executeQuery(query, [], function(result) 
        { 
            if (result.length > 0) 
            { 
                res.send(result[2]); //without the [2] it sends three objects: two empty ones and the third (result[2]) containing the games
            } 
            else 
            { 
                res.send(401, "result.length !> 0"); 
            } 
        }) 
 
        next(); 
    }); 
}

module.exports = function (server, database)
{
    return Stats.init(server, database);
}