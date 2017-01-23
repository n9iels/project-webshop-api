var Authenticate = require('../helpers/authenticate');

var Stats = {} 
 
Stats.init = function(server, database) 
{
    // Endpoint for '/stats' to get info of users 
    server.get('stats', Authenticate.admin, function (req, res, next) // NOTICE: 'stats/:month'
    { 
        database.executeQuery("SELECT DISTINCT pii.title, pii.subtitle, g.platform FROM orders_contain_games ocg JOIN  `order` o ON ocg.user_id = o.user_id JOIN game g ON ocg.ean_number = g.ean_number JOIN platform_independent_info pii on g.pi_id = pii.pi_id WHERE STATUS !=  'cart'", [], function(result) 
        { 
            if (result.length > 0) 
            { 
                res.send(result); 
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