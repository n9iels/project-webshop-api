var Authenticate = require('../helpers/authenticate');

var Stats = {} 
 
Stats.init = function(server, database) 
{
    // Endpoint for '/stats/topgames' to get games bought by most users
    server.get('stats/topgames', Authenticate.admin, function (req, res, next) // NOTICE: 'stats/:month'
    { 
        var cur_date = new Date(); //current date

        // var cur_day = cur_date.getDate();
        // var cur_month = cur_date.getMonth() + 1;
        // var cur_year = cur_date.getFullYear();

        // cur_day = putZeroBeforeNum(cur_day);
        // cur_

        // var end_date = "'" + cur_year + "-" + cur_month + "-" + cur_day + "'";


        // var begin_date = cur_date;
        // begin_date.setMonth(cur_date.getMonth() - 3);

        // begin_date = "'" + begin_date.getYear() + "-" + begin_date.getMonth() + "-" + cur_day.getDate() + "'";




        var hoogst_aantal_users_qry =
       "SET @prev_value = NULL;\
        SET @rank_count = 0;\
        SELECT * \
        FROM (\
            SELECT stock, title, subtitle, user_count, CASE\
                WHEN @prev_value = user_count THEN @rank_count\
                WHEN @prev_value := user_count THEN @rank_count := @rank_count + 1\
                END AS rank\
            FROM ( \
        SELECT g.stock, pii.title, pii.subtitle, COUNT(ocg.user_id) as user_count\
        FROM `order` o\
        JOIN orders_contain_games ocg ON o.order_number = ocg.order_number\
        JOIN game g ON g.ean_number = ocg.ean_number\
        JOIN platform_independent_info pii ON pii.pi_id = g.pi_id\
        WHERE o.order_date BETWEEN '2017-01-01' AND '2017-01-31'\
        GROUP BY pii.title\
        ORDER BY user_count DESC\
                    ) as nice\
            ) as ranked\
        WHERE rank <= 10"

        database.executeQuery(hoogst_aantal_users_qry, [], function(result, error)
        {
            if (error)
            {
                res.send(500, error)
            }
            else if (result.length > 0) 
            { 
                res.send(result[2]); //without the [2] it sends three objects: two empty ones and the third (result[2]) containing the games
            } 
            else 
            { 
                res.send(404, "result.length !> 0"); 
            } 
        }) 
 
        next(); 
    }); 

    function putZeroBeforeNum (num) {
        if (parseInt(num) < 10) {
            num = "0" + num;
            console.log(num);
        }
    }
}

module.exports = function (server, database)
{
    return Stats.init(server, database);
}