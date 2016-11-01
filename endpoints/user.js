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
        // If the post data is correctly set we can check the credentials
        Database.executeQuery("SELECT * FROM user JOIN session ON user.user_id = session.user_id WHERE session.access_token = ?", [req.authorization.credentials], function (result)
        {
            if (result.length > 0)
            {
                res.send(result);
            }
            else
            {
                res.send(401, "Bad credentials")
            }
        });
    });

    // Endpoint for '/login' to generate a login token
    server.post('user/login', function (req, res, next)
    {
        // Get email and password
        try
        {
            var post     = JSON.parse(req.body);
            var email    = post.email;
            var password = post.password;
        }
        catch (err)
        {
            res.send(401, "Bad credentials")
        }
        
        // If the post data is correctly set we can check the credentials
        Database.executeQuery("SELECT * FROM user WHERE email = ? AND password = ?", [email, password], function (result)
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

    server.post('user/register', function (req, res, next)
    {
        try
        {
            var post = JSON.parse(req.body);

            // Get e-mail, password, first_name, surname, gender, date_of_birth, phone_number
            var email = post.email;
            var password = post.password;
            var first_name = post.first_name;
            var surname = post.surname;
            var gender = post.gender;
            var date_of_birth = post.date_of_birth;
            var phone_number = post.phone_number;
        }
        catch (err)
        {
            res.send(422, "Missing fields")
        }

        Database.executeQuery("INSERT INTO user (email, password, first_name, surname, gender, date_of_birth, phone_number) VALUES (?,?,?,?,?,?,?)", [email, password, first_name, surname, gender, date_of_birth, phone_number], function (result, error)
        {
            if (error)
            {
                res.send(422, "There are missing fields or the email allready exists")
            }

            res.send("You have been successfully registered :p")
        });

        next();
    });
};

module.exports = function (server)
{
    return User.init(server);
}