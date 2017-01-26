var Authenticate = require('../helpers/authenticate');

var Stats = {} 
 
Stats.init = function(server, database) 
{
    // Endpoint for '/stats' to get info of users 
    server.get('stats', Authenticate.admin, function (req, res, next) // NOTICE: 'stats/:month'
    { 
        var aantal_copies_query = 
       "SET @prev_value = NULL;\
        SET @rank_count = 0;\
        SELECT * FROM\
        (\
            SELECT piit.title, piit.subtitle, super_amount, CASE\
                WHEN @prev_value = super_amount THEN @rank_count\
                WHEN @prev_value := super_amount THEN @rank_count := @rank_count + 1\
                END AS rank\
            FROM ( \
                SELECT pii.title, pii.subtitle, sum(ocg.amount) as super_amount\
                FROM orders_contain_games ocg\
                    JOIN game g ON g.ean_number = ocg.ean_number\
                    JOIN platform_independent_info pii ON pii.pi_id = g.pi_id\
                GROUP BY pii.title\
                ORDER BY super_amount desc\
            ) as piit\
        ) as ranked\
        WHERE ranked.rank <= 10"

        var aantal_users_query =
       "SET @prev_value = NULL;\
        SET @rank_count = 0;\
        SELECT * FROM\
        (\
            SELECT ocgt.title, ocgt.subtitle, super_amount, CASE\
                WHEN @prev_value = super_amount THEN @rank_count\
                WHEN @prev_value := super_amount THEN @rank_count := @rank_count + 1\
                END AS rank\
            FROM (\
                    SELECT pii.title, pii.subtitle, sum(ocg.amount) as super_amount\
                    FROM orders_contain_games ocg\
                        JOIN game g ON g.ean_number = ocg.ean_number\
                        JOIN platform_independent_info pii ON g.pi_id = pii.pi_id\
                    GROUP BY pii.title\
                    ORDER BY super_amount DESC\
            ) as ocgt\
        ) as ranked\
        WHERE ranked.rank <= 10"

        database.executeQuery(aantal_users_query, [], function(result) 
        { 
            if (result.length > 0) 
            { 
                console.log(result);
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