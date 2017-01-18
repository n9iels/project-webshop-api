var DatabaseHelper = require('../helpers/database');
var jwt            = require('../helpers/jwt')(require('crypto'), require('base64url'));
var bcrypt         = require('bcrypt-nodejs');
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
        var access_token = authorization.credentials;

        // Verify access_token
        jwt.verify(access_token, function(success)
        {
            var jwt_usertype = jwt.decode(access_token).payload.usertype;

            if (success && Authenticate.authorize(jwt_usertype, usertype))
            {
                callback(true);
            }
            else
            {
                callback(false);
            }
        });
    }
    else if (authorization.scheme == 'Basic')
    {
        var username = authorization.basic.username;
        var password = authorization.basic.password;

        // Check if the username and password are valid and create session
        Database.executeQuery("SELECT * FROM user WHERE email = ?", [username], function (result, error)
        {
            if (result.length > 0)
            {
                bcrypt.compare(password, result[0].password, function(err, res)
                {
                    if (res)
                    {
                        Authenticate.generateToken(result, function (accesstoken, user)
                        {
                            callback(true, accesstoken);
                        });
                    }
                    else
                    {
                        callback(false);
                    }
                });
            }
            else
            {
                callback(false);
            }
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
 * @param {Object} usertype      Type of the user
 * @param {string} typetoverify  Type to verify
 *
 * @return {bool} Returns true if the user is authorized, false otherwise
 */
Authenticate.authorize = function(usertype, typetoverify)
{
    if (usertype != typetoverify && usertype != "admin")
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
        else
        {
            res.send(401, {message:"Bad credentials"});
        }        
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
        else
        {
            res.send(401, {message:"Bad credentials"});
        }
    });
}

/**
 * Generate a access token for a user
 * 
 * @return {void}
 */
Authenticate.generateToken = function(user, callback)
{
    var usertype = 'customer';

    if (user[0].user_type == 'admin')
    {
        usertype = 'admin';
    }

    jwt.sign({iss:user[0].user_id, usertype:usertype}, function (token) {
        callback(token);
    });
}

/**
 * Hash a password
 * 
 * @param {string} string String  to hash
 */
Authenticate.hash = function(string)
{
    return bcrypt.hashSync(string);
}

Authenticate.decodeToken = function(token)
{
    return jwt.decode(token);
}

module.exports = {
    customer: Authenticate.customer,
    admin: Authenticate.admin,
    generateToken: Authenticate.generateToken,
    authenticate: Authenticate.authenticate,
    decodetoken: Authenticate.decodeToken,
    hash: Authenticate.hash
};