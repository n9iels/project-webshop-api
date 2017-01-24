var Authenticate = require('../helpers/authenticate');

/**
 * User class to define endpoints related to user activities
 */
var Favoritelist = {};

/**
 * User Contructor
 *
 * @method init
 * @param {Object} server  Restify Server Object
 *
 * @return {void}
 */

Favoritelist.init = function(server, database)
{
    server.get('favoritelist', Authenticate.customer, function (req, res, next)
    {
        var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;

        // Select ALL GAMES for CURRENT USER inside his/her FAVORITE LIST (= Letter R in CRUD)
        database.executeQuery("", [user_id], function (result)
        {
                res.send(result);
        })
    }
    );

    server.post('favoritelist/:user_id/:ean_number', Authenticate.customer, function(req, res, next)
    {
        try
        {
            var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;
        }
        catch (err)
        {
            res.send(422, "missing fields..")
        }

        // Add GAME for CURRENT USER inside his/her FAVORITELIST (= Letter C in CRUD)
        database.executeQuery("", [user_id, req.params.ean_number], function (result, error)
        {
            if (error)
            {
                // Check if we get a DUPLICATED_KEY error
                if (error.errno == 1062)
                {
                    res.send(409, "Duplicated entry");
                }
                else
                {
                    res.send(500, error);
                }
            }
            else 
            {
                res.send("Succesvol toegevoegd aan favorieten lijst.")
            }
        });
    });

    server.del('favoritelist/:user_id/:ean_number', Authenticate.customer, function(req, res, next)
    {
        try
        {
            var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;
        }
        catch (err)
        {
            res.send(422, "failed to get user_id from token");
        }

        // DELETE GAME for CURRENT USER inside his/her FAVORITELIST (= Letter D in CRUD)
        database.executeQuery("", [user_id, req.params.ean_number], function(result, error)
        {
            if (error) {
                res.send(500, error);
            } else if (result.affectedRows == 0) {
                res.send(404, "item not found"); // Error message
            } else {
                res.send("item deleted!");
            }
        })
    })
};

module.exports = function (server, database)
{
    return Favoritelist.init(server, database);
}