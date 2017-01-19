var Authenticate = require('../helpers/authenticate'); 
 
var Admin = {} 
 
Admin.init = function(server, database) 
{ 
    // Endpoint for '/admin' to get info of users 
    server.get('admin/user/:id', function (req, res, next) //, Authenticate.admin 
    { 
        database.executeQuery("SELECT * FROM  user WHERE user_id = ?", [req.params.id], function(result) 
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
    server.get('admin/users', function (req, res, next) //, Authenticate.admin 
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

    server.patch('admin/update_user', function(req, res, next)
    {
        
    })
 
} 
 
 
module.exports = function (server, database) 
{ 
    return Admin.init(server, database); 
}