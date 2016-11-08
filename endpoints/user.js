var Authenticate = require('../helpers/authenticate');

/**
 * User class to define endpoints related to user activities
 */
var User = {};

/**
 * User Contructor
 *
 * @method init
 * @param {Object} server  Restify Server Object
 *
 * @return {void}
 */
User.init = function(server, database)
{
    // Endpoint for '/user' to receive all products in the database
    server.get('user', Authenticate.customer, function (req, res, next)
    {
        // If the post data is correctly set we can check the credentials
        database.executeQuery("SELECT * FROM user JOIN session ON user.user_id = session.user_id WHERE session.access_token = ?", [req.authorization.credentials], function (result)
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
        database.executeQuery("SELECT * FROM user WHERE email = ? AND password = ?", [email, password], function (result)
        {
            if (result.length > 0)
            {
                Authenticate.generateToken(result[0], function (accessToken) {
                    res.send({access_token:accessToken, user_id:result[0].user_id});
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
        var post = JSON.parse(req.body);
        
        // Get user id 
        var user_id = post.user_id;
        
        database.executeQuery("DELETE FROM session WHERE user_id = ?", [user_id], function (result)
        {
          res.send("Successfully deleted user (R.I.P)")
        });

        next();
    });

    // Endpoint for '/resetpassword' to reset a password for a user
    server.post('user/resetpassword', function (req, res, next)
    {
        try
        {
            var post = req.body;

            // Get user id, new password, repeated password, email, secret question and the answer to the secret question
            var user_id = post.user_id; 
            var new_password = post.new_password;
            var repeat_password = post.repeat_password;
            var e_mail = post.e_mail;
            var secret_question = post.secret_question;
            var secret_question_answer = post.secret_question_answer;
        }
        catch (err)
        {
            res.send(422, "Missing fields")
        }
        
        database.executeQuery("SELECT * FROM user WHERE user_id = ? AND email = ? AND secret_question = ? AND secret_question_answer = ?", [user_id, email, secret_question, secret_question_answer], function (result)
        {
            if (result.length == 0)
            {
                res.send(401)
            }
        });

        database.executeQuery("UPDATE user SET password = ? WHERE user_id = ?", [new_password, user_id], function (result)
        {
          res.send("The password for the user has been successfully reset")
        });

        next();
    });

    server.post('user/register', function (req, res, next)
    {
        try
        {
            var post = JSON.parse(req.body);

            // Get e-mail, password, first_name, surname, gender, date_of_birth, phone_number, secret_question and secret_question_answer
            var e_mail = post.e_mail;
            var password = post.password;
            var first_name = post.first_name;
            var surname = post.surname;
            var gender = post.gender;
            var date_of_birth = post.date_of_birth;
            var phone_number = post.phone_number;
            var secret_question = post.secret_question;
            var secret_question_answer = post.secret_question_answer;
        }
        catch (err)
        {
            res.send(422, "Missing fields")
        }
       
        database.executeQuery("INSERT INTO user (email, password, first_name, surname, gender, date_of_birth, phone_number, secret_question, secret_question_answer) VALUES (?,?,?,?,?,?,?,?,?)", [e_mail, password, first_name, surname, gender, date_of_birth, phone_number, secret_question, secret_question_answer], function (result, error)
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

module.exports = function (server, database)
{
    return User.init(server, database);
}