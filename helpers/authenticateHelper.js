function AuthenticateHelper(database, jwt, bcrypt)
{
    // Reference to the object for callback
    self          = this;

    // Assign properties
    this.database = database;
    this.jwt      = jwt;
    this.bcrypt   = bcrypt;

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
        if (authorization.scheme == 'Bearer')
        {
            var access_token = authorization.credentials;

            // Verify access_token
            self.jwt.verify(access_token, function(success)
            {
                var jwt_usertype = self.jwt.decode(access_token).payload.usertype;

                if (success && self.authorize(jwt_usertype, usertype))
                {
                    var user_id = self.decodetoken(access_token).payload.iss;
                    
                    // Check if the user is not blocked
                    self.database.executeQuery("SELECT * FROM `user` WHERE user_id = ? AND is_active = 1", [user_id], function(result, error)
                    {
                        if (error)
                        {
                            callback(false)
                        }
                        else if (result.length < 1)
                        {
                            callback(false)
                        }
                        else
                        {
                            callback(true);
                        }
                    });
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
            self.database.executeQuery("SELECT * FROM user WHERE email = ?", [username], function (result, error)
            {
                if (result.length > 0 && result[0].is_active == 1)
                {
                    self.bcrypt.compare(password, result[0].password, function(err, res)
                    {
                        if (res)
                        {
                            self.generateToken(result, function (accesstoken, user)
                            {
                                callback(true, accesstoken, user);
                            });
                        }
                        else
                        {
                            callback(false);
                        }
                    });
                }
                else if (result[0].is_active == 0)
                {
                    // Last parameter means blocked
                    callback(false, null, null, true)
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
    this.authorize = function(usertype, typetoverify)
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
    this.customer = function(req, res, next)
    {
        self.authenticate(req.authorization, 'customer', function (result)
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
    this.admin = function(req, res, next)
    {
        self.authenticate(req.authorization, 'admin', function (result, blocked)
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
    this.generateToken = function(user, callback)
    {
        var usertype = 'customer';

        if (user[0].user_type == 'admin')
        {
            usertype = 'admin';
        }

        self.jwt.sign({iss:user[0].user_id, usertype:usertype}, function (token) {
            callback(token, user);
        });
    }

    /**
     * Hash a password
     * 
     * @param {string} string String  to hash
     */
    this.hash = function(string)
    {
        return bcrypt.hashSync(string);
    }

    this.decodetoken = function(token)
    {
        return self.jwt.decode(token);
    }
}

module.exports = function(database, jwt, bcrypt)
{
    return new AuthenticateHelper(database, jwt, bcrypt);
}