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
    server.get('wishlist', Authenticate.customer, function (req, res, next)
    {
        var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;

        database.executeQuery("SELECT * FROM game g, platform_independent_info p, wishlist w, wishlist_items wi, user u WHERE u.user_id = w.user_id AND w.wishlist_id = wi.wishlist_id AND wi.ean_number = g.ean_number AND p.pi_id = g.pi_id AND u.user_id and u.user_id = ?", [user_id], function (result)
        {
                res.send(result);
        })
    }
    );

    server.post('wishlist/:user_id/:ean_number', Authenticate.customer, function(req, res, next)
    {
        try
        {
            var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;
        }
        catch (err)
        {
            res.send(422, "missing fields..")
        }

        database.executeQuery("INSERT INTO wishlist_items (wishlist_id, ean_number) VALUES ((SELECT wishlist_id FROM wishlist WHERE user_id = ?), ?)", [user_id, req.params.ean_number], function (result, error)
        {
            if (error)
            {
                res.send(500,"Het is niet gelukt om de item toe te voegen aan de Wishlist.")
            }
            else 
            {
                res.send("Succesvol toegevoegd aan Wishlist.")
            }
        });
    });
};



module.exports = function (server, database)
{
    return Wishlist.init(server, database);
}