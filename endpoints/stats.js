var Authenticate = require('../helpers/authenticateHelper');

var Stats = {} 
 
Stats.init = function(server, database, Authenticate) 
{
    // Endpoint for '/stats/topgames' to get games bought by most users
    server.get('stats/topgames', Authenticate.admin, function (req, res, next) // NOTICE: 'stats/:month'
    { 
        var b_date = req.query.b_date;
        var e_date = req.query.e_date;

        var topgames_qry =
       "SET @prev_value = NULL;\
        SET @rank_count = 0;\
        SELECT * \
        FROM (\
            SELECT stock, title, subtitle, user_count, CASE\
                WHEN @prev_value = user_count THEN @rank_count\
                WHEN @prev_value := user_count THEN @rank_count := @rank_count + 1\
                END AS rank\
            FROM ( \
        SELECT g.stock, pii.title, pii.subtitle, COUNT(DISTINCT ocg.user_id) as user_count\
        FROM `order` o\
        JOIN orders_contain_games ocg ON o.order_number = ocg.order_number\
        JOIN game g ON g.ean_number = ocg.ean_number\
        JOIN platform_independent_info pii ON pii.pi_id = g.pi_id\
        WHERE o.order_date BETWEEN '" + b_date + "' AND '" + e_date + "'\
        GROUP BY pii.title\
        ORDER BY user_count DESC\
                    ) as nice\
            ) as ranked\
        WHERE rank <= 10"

        database.executeQuery(topgames_qry, [], function(result, error)
        {
            if (error)
            {
                res.send(500, error)
            }
            else if (result.length > 0) // not sure whether this works (see comment below. put result[2] here as well?)
            { 
                res.send(result[2]); //without the [2] it sends three objects: two empty ones and the third (result[2]) containing the games
            } 
            else 
            { 
                res.send(404, "result.length !> 0"); 
            } 
        }) 
 
        next(); 
    })

    // Endpoint for '/stats/rev' to get revenue per day
    server.get('stats/rev', Authenticate.admin, function (req, res, next) // NOTICE: 'stats/:month'
    { 
        var b_date = req.query.b_date;
        var e_date = req.query.e_date;

        var revenue_qry =
       "SELECT order_date, SUM(total_order_price) as day_price\
        FROM `order`\
        WHERE `status` = 'paid' AND order_date BETWEEN '" + b_date + "' AND '" + e_date + "'\
        GROUP BY YEAR(order_date), MONTH(order_date), DAY(order_date)\
        ORDER BY order_date"

        database.executeQuery(revenue_qry, [], function(result, error)
        {
            if (error)
            {
                res.send(500, error)
            }
            else if (result.length > 0) 
            { 
                res.send(result);
            } 
            else 
            { 
                res.send(404, "result.length !> 0"); 
            } 
        }) 
 
        next(); 
    })

    // Endpoint for '/stats/useramnt' to get user amount per day
    server.get('stats/useramnt', Authenticate.admin, function (req, res, next) // NOTICE: 'stats/:month'
    { 
        var b_date = req.query.b_date;
        var e_date = req.query.e_date;

        var useramnt_qry = "SELECT registration_date FROM `user` WHERE registration_date BETWEEN '1900-01-01' AND '" + e_date + "' ORDER BY registration_date";

        database.executeQuery(useramnt_qry, [], function(result, error)
        {
            if (error)
            {
                res.send(500, error)
            }
            else if (result.length > 0) 
            { 
                res.send(result);
            } 
            else 
            { 
                res.send(404, "result.length !> 0"); 
            } 
        }) 
 
        next(); 
    })
}


module.exports = function (server, database, Authenticate)
{
    return Stats.init(server, database, Authenticate);
}