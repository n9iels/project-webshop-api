var Authenticate = require('../helpers/authenticateHelper');

var Stats = {} 
 
Stats.init = function(server, database, Authenticate) 
{
    // Endpoint for '/stats/topgames' to get games bought by most users
    server.get('stats/topgames', Authenticate.admin, function (req, res, next) // NOTICE: 'stats/:month'
    { 
        // try
        // {
        //     var post = req.body;
        //     // Get range from ajax
        //     var range = post.range;
        // }
        // catch (err)
        // {
        //     res.send(422, "Missing fields")
        // }


        // meegeven via ajax: "month" "quarter" of "year"
        var input = "quarter"; //this should come from ajax (res.)

        var cur_date = new Date(); //current date

        var cur_day = cur_date.getDate();
        var cur_month = cur_date.getMonth() + 1;
        var cur_year = cur_date.getFullYear();

        // create end date string to put in query
        var qry_end_date = String(cur_year) + "-" + putZeroBeforeNum(cur_month) + "-" + putZeroBeforeNum(cur_day);
        
        // get right begin date
        var begin_day = cur_day;
        var begin_month = cur_month;
        var begin_year = cur_year;

        var months_earlier = 0;
        if (input == "month") {
            months_earlier = 1;
        } else if (input == "quarter") {
            months_earlier = 3;
        } else if (input == "year") {
            months_earlier = 12;
        } else {
            console.log("input has unexpected value. input = " + input);
        }
        while (months_earlier > 0) {
            begin_month -= 1;
            if (begin_month == 0) {
                begin_year -= 1;
                begin_month += 12;
            }
            months_earlier--;
        }

        // make begin date into string to put in query
        var qry_begin_date = String(begin_year) + "-" + putZeroBeforeNum(begin_month) + "-" + putZeroBeforeNum(begin_day);

        // cur_day = putZeroBeforeNum(cur_day);
        // cur_

        // var end_date = "'" + cur_year + "-" + cur_month + "-" + cur_day + "'";


        // var begin_date = cur_date;
        // begin_date.setMonth(cur_date.getMonth() - 3);

        // begin_date = "'" + begin_date.getYear() + "-" + begin_date.getMonth() + "-" + cur_day.getDate() + "'";


        //qry_begin_date



        //date format: 2017-01-31
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
        WHERE o.order_date BETWEEN '" + qry_begin_date + "' AND '" + qry_end_date + "'\
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
        if (parseInt(num) < 10)
        {
            num = "0" + String(num);
            console.log(num);
            return num;
        } else {
            return num;
        }
    }
}

module.exports = function (server, database, Authenticate)
{
    return Stats.init(server, database, Authenticate);
}