var Authenticate = {};

/**
* Check if the given credentials are valid
*
* @method authenticate
* @param {Object} authorization Authorization header
*
* @return {string} Returns a json string with the result
*/
Authenticate.authenticate = function(authorization)
{
    if (authorization.scheme == 'Bearer')
    {
        var accessToken = authorization.credentials;

        // Check if the access token is valid
    }
    else if (authorization.scheme == 'Basic')
    {
        var username = authorization.basic.username;
        var password = authorization.basic.password;

        // Check if the username and password are valid and create session
    }

    // Return a json object with the result
    return JSON.stringify(result);
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
    if (user.type != usertype && user.type != "admin")
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
    var authenticate = JSON.parse(Authenticate.authenticate(req.authorization));
    
    if (authenticate.success)
    {
        if (Authenticate.authorize(authenticate.user, 'customer'))
        {
            next();
        }
    }

    res.send(401, {message:"Not Authorized"});
}

/**
* Check if a user has customer access
*
* @return {void}  Goes to the next handler if the user has access, abort otherwise
*/
Authenticate.admin = function(req, res, next)
{
    var authenticate = JSON.parse(Authenticate.authenticate(req.authorization));
    
     if (authenticate.success)
     {
        if (Authenticate.authorize(authenticate.user, 'admin'))
        {
            next();
        }
    }

    res.send(401, {message:"Not Authorized"});
}

module.exports = {
    Customer: Authenticate.customer,
    Admin: Authenticate.admin,
};