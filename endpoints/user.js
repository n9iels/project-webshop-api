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
};

module.exports = function (server)
{
    return User.init(server);
}