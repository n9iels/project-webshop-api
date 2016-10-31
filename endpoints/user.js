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

    // Endpoint for '/logout' to delete a login token
    server.post('user/logout', function (req, res, next)
    {
        // JSON.parse moet weg
        var post = req.body;
        // var post = JSON.parse(req.body);

        // Get user id 
        var user_id = post.user_id;
        
        Database.executeQuery("DELETE FROM `session` WHERE user_id = ?", [user_id], function (result)
        {
          res.send("Successfully deleted user (R.I.P)")
        });



        next();
    });

    // Endpoint for '/resetpassword' to reset a password for a user
    server.post('user/resetpassword', function (req, res, next)
    {
        // JSON.parse moet weg
        var post = req.body;

        // Get user id and current password
        var user_id = post.user_id; 
        var password = post.password;
        var security_question = post.security_question;
        var security_question_answer = post.security_question_answer;
        
        Database.executeQuery("SELECT * FROM user WHERE user_id = ? AND password = ? AND security_question = ? AND security_question_answer = ?", [user_id, password, security_question, security_question_answer], function (result)
        {
            if (result.length > 0)
            {
                Database.executeQuery("UPDATE user SET password = ? WHERE user_id = ?", [password, user_id], function (result)
                {
                  res.send("The password for the user has been successfully reset")
                });
            }
        });

        next();
    });

    server.post('user/register', function (req, res, next)
    {
        var post = req.body;

        // Get e-mail, password, first_name, surname, gender, date_of_birth, phone_number, security_question and security_question_answer
        var e_mail = post.e_mail;
        var password = post.password;
        var first_name = post.first_name;
        var surname = post.surname;
        var gender = post.gender;
        var date_of_birth = post.date_of_birth;
        var phone_number = post.phone_number;
        var security_question = post.security_question;
        var security_question_answer = post.security_question_answer;
        
        Database.executeQuery("INSERT INTO user (email, password, first_name, surname, gender, date_of_birth, phone_number, security_question, security_question_answer) VALUES (?,?,?,?,?,?,?,?,?)", [e_mail, password, first_name, surname, gender, date_of_birth, phone_number, security_question, security_question_answer], function (result)
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



