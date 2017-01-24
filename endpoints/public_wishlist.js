/**
 * User class to define endpoints related to user activities
 */
var PublicWishlist = {};

/**
 * User Contructor
 *
 * @method init
 * @param {Object} server  Restify Server Object
 *
 * @return {void}
 */

PublicWishlist.init = function (server, database)
{
    server.get('public_wishlist/:user_id', function (req, res, next)
    {
        database.executeQuery("SELECT * FROM wishlist_items, user, game, platform_independent_info WHERE user_id = ? ", req.params.user_id, function (error, result)
        {
            if(error)
            {
                res.send(500, error);
            }
            else
            {
                 if(result.length > 0)
                 {
                     result.send();
                 }
                 else
                 {
                     res.send(404, "Verlanglijst niet gevonden!");
                 }
            }
               
        })
    }
    );
};

module.exports = function (server, database)
{
    return PublicWishlist.init(server, database);
}