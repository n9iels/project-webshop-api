var Authenticate = require('../helpers/authenticate');

/**
 * User class to define endpoints related to user activities
 */
var Wishlist = {};

/**
 * User Contructor
 *
 * @method init
 * @param {Object} server  Restify Server Object
 *
 * @return {void}
 */

    

Wishlist.init = function(server, database)
{
    server.get('wishlist/:user_id', Authenticate.customer, function (req, res, next)
        {
            database.executeQuery("SELECT * FROM game g, platform_independent_info p, wishlist w, wishlist_items wi, user u WHERE u.user_id = w.user_id AND w.wishlist_id = wi.wishlist_id AND wi.ean_number = g.ean_number AND p.pi_id = g.pi_id AND u.user_id and u.user_id = ?", [req.params.user_id], function (result)
            {
                
                    res.send(result);
            })
        }
    );
}
module.exports = function (server, database)
{
    return Wishlist.init(server, database);
}