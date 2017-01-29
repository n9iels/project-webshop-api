function AuthenticateHelper()
{
    /**
     * Check if the given credentials are valid
     *
     * @method authenticate
     * @param {Object} authorization Authorization header
     *
     * @return {string} Returns a json string with the result
     */
    this.authenticate = function(authorization, usertype, callback)
    {
        callback(true, "token", 1);
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
    this.authorize = function(usertype, typetoverify)
    {
        return true;
    }

    /**
     * Check if a user has customer access
     *
     * @return {void}  Goes to the next handler if the user has access, abort otherwise
     */
    this.customer = function(req, res, next)
    {
        res.send(401, {message:"Bad credentials"});
    }

    /**
     * Check if a user has admin access
     *
     * @return {void}  Goes to the next handler if the user has access, abort otherwise
     */
    this.admin = function(req, res, next)
    {
        res.send(401, {message:"Bad credentials"});
    }

    /**
     * Generate a access token for a user
     * 
     * @return {void}
     */
    this.generateToken = function(user, callback)
    {
        callback("token", 1)
    }

    /**
     * Hash a password
     * 
     * @param {string} string String  to hash
     */
    this.hash = function(string)
    {
        return string;
    }

    this.decodetoken = function(token)
    {
        return token;
    }
}

module.exports = new AuthenticateHelper();