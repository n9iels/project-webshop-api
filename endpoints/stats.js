var Authenticate = require('../helpers/authenticateHelper');

var Stats = {} 
 
Stats.init = function(server, database, Authenticate) 
{
    // Endpoint for '/stats/topgames' to get games bought by most users
    server.get('stats/topgames', function (req, res, next) // NOTICE: 'stats/:month'
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
        SELECT g.stock, pii.title, pii.subtitle, COUNT(ocg.user_id) as user_count\
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
    })
}






    // // Endpoint for '/stats/topgames' to get games bought by most users
    // server.get('stats/topgames0', Authenticate.admin, function (req, res, next) // NOTICE: 'stats/:month'
    // { 
    //     // input will be: begin_date : "...-...-..." end_date : "...-...-..."

    //     var range = req.query.range;

    //     var cur_date = new Date(); //current date

    //     var cur_day = cur_date.getDate();
    //     var cur_month = cur_date.getMonth() + 1;
    //     var cur_year = cur_date.getFullYear();

    //     // create end date string to put in query
    //     var qry_end_date = String(cur_year) + "-" + putZeroBeforeNum(cur_month) + "-" + putZeroBeforeNum(cur_day);
        
    //     // get right begin date
    //     var begin_day = cur_day;
    //     var begin_month = cur_month;
    //     var begin_year = cur_year;

    //     var months_earlier = 0;
    //     if (range == "month") {
    //         months_earlier = 1;
    //     } else if (range == "quarter") {
    //         months_earlier = 3;
    //     } else if (range == "year") {
    //         months_earlier = 12;
    //     } else {
    //         console.log("range has unexpected value. range = " + range);
    //     }
    //     while (months_earlier > 0) {
    //         begin_month -= 1;
    //         if (begin_month == 0) {
    //             begin_year -= 1;
    //             begin_month += 12;
    //         }
    //         months_earlier--;
    //     }

    //     // make begin date into string to put in query
    //     var qry_begin_date = String(begin_year) + "-" + putZeroBeforeNum(begin_month) + "-" + putZeroBeforeNum(begin_day);

    //     //date format: 2017-01-31
    //     var hoogst_aantal_users_qry =
    //    "SET @prev_value = NULL;\
    //     SET @rank_count = 0;\
    //     SELECT * \
    //     FROM (\
    //         SELECT stock, title, subtitle, user_count, CASE\
    //             WHEN @prev_value = user_count THEN @rank_count\
    //             WHEN @prev_value := user_count THEN @rank_count := @rank_count + 1\
    //             END AS rank\
    //         FROM ( \
    //     SELECT g.stock, pii.title, pii.subtitle, COUNT(ocg.user_id) as user_count\
    //     FROM `order` o\
    //     JOIN orders_contain_games ocg ON o.order_number = ocg.order_number\
    //     JOIN game g ON g.ean_number = ocg.ean_number\
    //     JOIN platform_independent_info pii ON pii.pi_id = g.pi_id\
    //     WHERE o.order_date BETWEEN '" + qry_begin_date + "' AND '" + qry_end_date + "'\
    //     GROUP BY pii.title\
    //     ORDER BY user_count DESC\
    //                 ) as nice\
    //         ) as ranked\
    //     WHERE rank <= 10"

    //     database.executeQuery(hoogst_aantal_users_qry, [], function(result, error)
    //     {
    //         if (error)
    //         {
    //             res.send(500, error)
    //         }
    //         else if (result.length > 0) 
    //         { 
    //             res.send(result[2]); //without the [2] it sends three objects: two empty ones and the third (result[2]) containing the games
    //         } 
    //         else 
    //         { 
    //             res.send(404, "result.length !> 0"); 
    //         } 
    //     }) 
 
    //     next(); 
    // }); 

    // function putZeroBeforeNum (num) {
    //     if (parseInt(num) < 10)
    //     {
    //         num = "0" + String(num);
    //         return num;
    //     } else {
    //         return num;
    //     }
    // }

    // function putGraphDataInArray(res, begin_date, end_date)
    // {
    //     var graphdata_array = [];
    //     // if one of the below does res.send(error) then this whole ajax call ends right?
    //     graphdata_array.Push(topTenData(res, begin_date, end_date));
    //     graphdata_array.Push(revenueData(res, begin_date, end_date));
    //     graphdata_array.Push(useramountData(res, begin_date, end_date));
    //     res.send(graphdata_array);
    // }

    // function topTenData(res, begin_date, end_date)
    // {
    //     //date format: 2017-01-31
    //     var hoogst_aantal_users_qry =
    //     "SET @prev_value = NULL;\
    //     SET @rank_count = 0;\
    //     SELECT * \
    //     FROM (\
    //         SELECT stock, title, subtitle, user_count, CASE\
    //             WHEN @prev_value = user_count THEN @rank_count\
    //             WHEN @prev_value := user_count THEN @rank_count := @rank_count + 1\
    //             END AS rank\
    //         FROM ( \
    //                 SELECT g.stock, pii.title, pii.subtitle, COUNT(ocg.user_id) as user_count\
    //                 FROM `order` o\
    //                 JOIN orders_contain_games ocg ON o.order_number = ocg.order_number\
    //                 JOIN game g ON g.ean_number = ocg.ean_number\
    //                 JOIN platform_independent_info pii ON pii.pi_id = g.pi_id\
    //                 WHERE o.order_date BETWEEN '?' AND '?'\
    //                 GROUP BY pii.title\
    //                 ORDER BY user_count DESC\
    //             ) as nice\
    //         ) as ranked\
    //     WHERE rank <= 10"

    //     database.executeQuery(hoogst_aantal_users_qry, [begin_date, end_date], function(result, error)
    //     {
    //         if (error)
    //         {
    //             res.send(500, error)
    //         }
    //         else if (result.length > 0) 
    //         { 
    //             return result[2]; //without the [2] it sends three objects: two empty ones and the third (result[2]) containing the games
    //         } 
    //         else 
    //         { 
    //             res.send(404, "Top 10 Games: result.length !> 0"); 
    //         } 
    //     }) 
    // }
    // function revenueData(begin_date, end_date)
    // {
    //     var rev_query = 
    //    "SELECT order_date AS day , SUM( total_order_price ) AS day_price\
    //     FROM `order` \
    //     WHERE `status` = 'paid'\
    //     AND order_date BETWEEN '?' AND '?'\
    //     GROUP BY YEAR( order_date ) , MONTH( order_date ) , DAY( order_date ) \
    //     ORDER BY order_date DESC "

    //     database.executeQuery(rev_query, [begin_date, end_date], function(result, error)
    //     {
    //         if (error)
    //         {
    //             res.send(500, error)
    //         }
    //         else if (result.length > 0) 
    //         { 
    //             return result; 
    //         }
    //         else 
    //         { 
    //             res.send(404, "Revenue graph: result.length !> 0"); 
    //         } 
    //     }) 
    // }
    // function useramountData(begin_date, end_date)
    // {
    //     var useramnt_query = 
    //    ""

    //     database.executeQuery(useramnt_query, [begin_date, end_date], function(result, error)
    //     {
    //         if (error)
    //         {
    //             res.send(500, error)
    //         }
    //         else if (result.length > 0) 
    //         { 
    //             return result;
    //         }
    //         else 
    //         { 
    //             res.send(404, "Useramount graph: result.length !> 0"); 
    //         } 
    //     }) 
    // }


module.exports = function (server, database, Authenticate)
{
    return Stats.init(server, database, Authenticate);
}