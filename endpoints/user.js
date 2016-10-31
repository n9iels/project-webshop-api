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

        // Get email and password
        var email    = post.email;
        var password = post.password;
        
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
        var post = req.body;

        // Get e-mail, password, first_name, surname, gender, date_of_birth, phone_number
        var e_mail = post.e_mail;
        var password = post.password;
        var first_name = post.first_name;
        var surname = post.surname;
        var gender = post.gender;
        var date_of_birth = post.date_of_birth;
        var phone_number = post.phone_number;
        
        Database.executeQuery("INSERT INTO user (email, password, first_name, surname, gender, date_of_birth, phone_number) VALUES (?,?,?,?,?,?,?)", [e_mail, password, first_name, surname, gender, date_of_birth, phone_number], function (result)
        //  Database.executeQuery("SELECT * FROM User WHERE username = ? AND password = ?", [username, password], function (result)
        {           
          res.send("You have been successfully registered :p")
        });

        next();
    });
};

module.exports = function (server)
{
    return User.init(server);
}