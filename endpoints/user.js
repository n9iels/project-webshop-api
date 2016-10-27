var Authenticate   = require('../helpers/authenticate');
var DatabaseHelper =  require('../helpers/database');
var Database       = new DatabaseHelper();
var User           = {};

/**
 * User Contructor
 *
 * @method init
 * @param {Object} server  Restify Server Object
 *
 * @return {void}
 */
User.init = function(server)
{
    // Endpoint for '/user' to receive all products in the database
    server.get('user', Authenticate.customer, function (req, res, next)
    {
        res.send("yeah");
        next();
    });

    // Endpoint for '/login' to generate a login token
    server.post('user/login', function (req, res, next)
    {
        var post = JSON.parse(req.body);

        // Get username and password
        var username = post.username;
        var password = post.password;
        
        Database.executeQuery("SELECT * FROM User WHERE username = ? AND password = ?", [username, password], function (result)
        {
            if (result.length > 0)
            {
                Authenticate.generateToken(result[0], function (accessToken) {
                    res.send({access_token:accessToken});
                });
            }
            else
            {
                res.send(401, "Bad credentials")
            }
        });

        next();
    });
};

module.exports = function (server)
{
    return User.init(server);
}