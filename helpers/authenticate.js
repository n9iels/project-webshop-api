var DatabaseHelper =  require('../helpers/database');
var crypto         = require('crypto');
var Database       = new DatabaseHelper();
var Authenticate   = {};

/**
 * Check if the given credentials are valid
 *
 * @method authenticate
 * @param {Object} authorization Authorization header
 *
 * @return {string} Returns a json string with the result
 */
Authenticate.authenticate = function(authorization, usertype, callback)
{
    if (authorization.scheme == 'Bearer')
    {
        var accessToken = authorization.credentials;

        return callback(false);
    }
    else if (authorization.scheme == 'Basic')
    {
        var username = authorization.basic.username;
        var password = authorization.basic.password;

        // Check if the username and password are valid and create session
        Database.executeQuery("SELECT * FROM Session JOIN User ON Session.user_id = User.user_id WHERE username = ?", [username], function (rows)
        {
            if (rows.length > 0)
            {
                if (Authenticate.authorize(rows[0], usertype) && rows[0].password == password)
                {
                    return callback(true);
                }
            }

            return callback(false);
        });
    }
    else
    {
        return callback(false);
    }
}

/**
 * Check if a user is authorized
 *
 * @method authorize
 * @param {Object} user      User object
 * @param {string} usertype  Type of the user
 *
 * @return {bool} Returns true if the user is authorized, false otherwise
 */
Authenticate.authorize = function(user, usertype)
{
    if (user.user_type != usertype && user.user_type != "admin")
    {
        return false;
    }

    return true;
}

/**
 * Check if a user has customer access
 *
 * @return {void}  Goes to the next handler if the user has access, abort otherwise
 */
Authenticate.customer = function(req, res, next)
{
    Authenticate.authenticate(req.authorization, 'customer', function (result)
    {
        if (result)
        {
            next();
        }

        res.send(401, {message:"Bad credentials"});
    });
}

/**
 * Check if a user has admin access
 *
 * @return {void}  Goes to the next handler if the user has access, abort otherwise
 */
Authenticate.admin = function(req, res, next)
{
    Authenticate.authenticate(req.authorization, 'admin', function (result)
    {
        if (result)
        {
            next();
        }

        res.send(401, {message:"Bad credentials"});
    });
}

/**
 * Generate a access token for a user
 * 
 * @return {void}
 */
Authenticate.generateToken = function(user, callback)
{
    var accessToken = crypto.randomBytes(48).toString('base64');
    
    Database.executeQuery("DELETE FROM Session WHERE user_id = ?; INSERT INTO Session VALUES (?, ?)", [user.user_id, user.user_id, accessToken], function (result) {});
    callback(accessToken);
}

module.exports = {
    customer: Authenticate.customer,
    admin: Authenticate.admin,
    generateToken: Authenticate.generateToken
};