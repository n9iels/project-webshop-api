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
        var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;

        // If the post data is correctly set we can check the credentials
        database.executeQuery("SELECT * FROM user WHERE user_id = ?", [user_id], function (result, error)
        {
            if (error)
            {
                res.send(500, error)
            }
            else
            {
                var user = result[0];

                database.executeQuery("SELECT * FROM address WHERE user_id = ?", [user_id], function (address, error)
                {
                    if (error)
                    {
                        res.send(500, error);
                    }
                    else
                    {
                        user.address = address[0];
                        
                        res.send(user)
                    }
                })
            }
        });
    });

    // Endpoint for '/login' to generate a login token
    server.get('user/login', function (req, res, next)
    {
        Authenticate.authenticate(req.authorization, 'customer', function(success, token, user)
        {
            if (success)
            {
                res.send({access_token:token, user_id:user[0].user_id})
            }
            else
            {
                res.send(403, "Login not successfull")
            }
        })
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
            var post = JSON.parse(req.body);

            // Get user id, new password, repeated password, email, secret question and the answer to the secret question
            var new_password = Authenticate.hash(post.new_password);
            var repeat_password = post.repeat_password;
            var e_mail = post.email;
            var secret_question = post.secret_question;
            var secret_question_answer = post.secret_question_answer;
        }
        catch (err)
        {
            res.send(422, "Missing fields")
        }
        
        database.executeQuery("SELECT * FROM user WHERE email = ? AND secret_question = ? AND secret_question_answer = ?", [e_mail, secret_question, secret_question_answer], function (result, error)
        {
            if (error || result.length == 0)
            {
                res.send(422, "The e-mailaddress does not exist or the secret question is incorrect")
            }
        });

        database.executeQuery("UPDATE user SET password = ? WHERE email = ?", [new_password, e_mail], function (result, error)
        {
            if (error)
            {
                res.send(422, "something went wrong when resetting the password")
            }

            res.send("The password for the user has been successfully reset")
        });

        next();
    });

    server.post('user/register', function (req, res, next)
    {
        try
        {
            var post = JSON.parse(req.body);
            console.log(post);

            // Get e-mail, password, first_name, insertion, surname, gender, date_of_birth, phone_number, secret_question and secret_question_answer
            var e_mail = post.e_mail;
            var password = Authenticate.hash(post.password);
            var first_name = post.first_name;
            var insertion = post.insertion;
            var surname = post.surname;
            var gender = post.gender;
            var date_of_birth = post.date_of_birth;
            var phone_number = post.phone_number;
            var secret_question = post.secret_question;
            var secret_question_answer = post.secret_question_answer;

            // Get street_name, number, postal_code and city
            var postal_code = post.postal_code;
            var house_number = post.number;
            var street_name = post.street_name;
            var city = post.city;
        }
        catch (err)
        {
            res.send(422, "Missing fields")
        }
       
        database.executeQuery("INSERT INTO user (email, password, first_name, insertion, surname, gender, date_of_birth, phone_number, secret_question, secret_question_answer) VALUES (?,?,?,?,?,?,?,?,?,?)", [e_mail, password, first_name, insertion, surname, gender, date_of_birth, phone_number, secret_question, secret_question_answer], function (result, error)
        {           
            if (error)
            {
                res.send(500, error)
            }
            else
            {
                database.executeQuery("INSERT INTO address (postal_code, house_number, user_id, street, city) VALUES (?,?,?,?,?)", [postal_code, house_number, result.insertId, street_name, city], function (result, error)
                {
                    if (error)
                    {
                        res.send(422, "There are missing fields")
                    }
                });

                database.executeQuery("INSERT INTO wishlist (is_public, user_id) VALUES (0, ?);", [result.insertId], function(result, error) 
                { 
                    if (error) 
                    { 
                        res.send(422, "There are missing fields") 
                    } 
                });

                res.send("You have been successfully registered :p") 
            }
        });
        next();
    });

    // Endpoint for '/users' to get user id's
    server.get('users', Authenticate.admin, function (req, res, next)
    {
        // If the post data is correctly set we can check the credentials
        database.executeQuery("SELECT first_name, insertion, surname, email, phone_number, user_type FROM user", function (result)
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


};

module.exports = function (server, database)
{
    return User.init(server, database);
}




