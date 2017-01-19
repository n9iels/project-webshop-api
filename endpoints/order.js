var Authenticate = require('../helpers/authenticate');

/**
 * Order endpoint related to order activities
 */
var Order = {};

Order.init = function(server, database)
{
    server.get("order", Authenticate.customer, function(req, res, next)
    {
        database.executeQuery("SELECT * FROM `order`", [], function (result, error)
        {
            if (result.length > 0)
            {
                return res.send(result);
            }

            return res.send(404, {message:"No results!"})
        });

        next();
    });
}

module.exports = function (server, database)
{
    return Order.init(server, database);
}