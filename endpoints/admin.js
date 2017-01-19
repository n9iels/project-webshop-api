var Authenticate = require('../helpers/authenticate'); 
 
var Admin = {} 
 
Admin.init = function(server, database) 
{ 
    // Endpoint for '/admin' to get info of users 
    server.get('admin/:id', function (req, res, next) //, Authenticate.admin 
    { 
        database.executeQuery("SELECT * FROM  user WHERE id = ?", [req.params.id], function(result) 
        { 
            if (result.length > 0) 
            { 
                res.send(result); 
            } 
            else 
            { 
                res.send(401, "result.length !> 0"); 
            } 
        }) 
 
        next(); 
    }); 
 
    // Endpoint for '/users' to get user id's 
    server.get('admin', function (req, res, next) //, Authenticate.admin 
    { 
        // If the post data is correctly set we can check the credentials 
        database.executeQuery("SELECT * FROM user", [], function (result) 
        { 
            if (result.length > 0) 
            { 
                res.send(result); 
            } 
            else 
            { 
                res.send(401, "result.length !> 0"); 
            } 
        }); 
    }); 
 
    // Endpoint for '/delete_user' for deleting user by admin 
    server.get('admin/d/delete_user', Authenticate.admin, function (req, res, next) 
    { 
        // delete user from relevant tables 
        database.executeQuery("SELECT first_name, insertion, surname, email, phone_number, user_type FROM user", [], function (result) 
        { 
            if (result.length > 0) 
            { 
                res.send(result); 
            } 
            else 
            { 
                res.send(401, "result.length !> 0"); 
            } 
        }); 
    }); 
 
} 
 
 
module.exports = function (server, database) 
{ 
    return Admin.init(server, database); 
}