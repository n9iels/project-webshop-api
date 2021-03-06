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

PublicWishlist.init = function (server, database, Authenticate)
{
    server.get('public_wishlist/:user_id', function (req, res, next)
    {
        database.executeQuery("SELECT u.first_name, u.insertion, u.surname, u.is_active, w.is_public, g.image, pii.title, pii.subtitle, g.platform, pii.genre, g.price, g.stock\
                               FROM user u JOIN wishlist w ON u.user_id = w.user_id JOIN wishlist_items wi ON w.wishlist_id = wi.wishlist_id JOIN game g ON g.ean_number = wi.ean_number JOIN platform_independent_info pii ON g.pi_id = pii.pi_id\
                               WHERE u.user_id = ?", [req.params.user_id], function (result, error)
        {
            if (error) {
                res.send(500, error);
            } else if (result.affectedRows == 0) {
                res.send(404, "public state nog edited");
            } else {
                res.send(result);
            }
        });

        next();
    });
};

module.exports = function (server, database, authenticate)
{
    return PublicWishlist.init(server, database, authenticate);
}