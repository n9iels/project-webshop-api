var Authenticate = require('../helpers/authenticate'); 
 
var Admin = {} 
 
Admin.init = function(server, database) 
{ 
    // Endpoint for '/admin' to get info of users 
    server.get('admin/users/:id', Authenticate.admin, function (req, res, next) //, Authenticate.admin 
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
    server.get('admin/users', Authenticate.admin, function (req, res, next) //, Authenticate.admin 
    {
        var user_id = Authenticate.decodetoken(req.authorization.credentials).payload.iss;

        // If the post data is correctly set we can check the credentials 
        database.executeQuery("SELECT * FROM user WHERE user_id != ?", [user_id], function (result) 
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

    server.patch('admin/users/:id', Authenticate.admin, function(req, res, next)
    {
        database.executeQuery("UPDATE user SET ? WHERE user_id = ?", [req.body, req.params.id], function(result, error)
        {
            if (error) {
                res.send(500, error);
            } else if (result.affectedRows == 0) {
                res.send(404, "user not found");
            } else {
                res.send("user updated!");
            }
        })
    })

    server.del('admin/users/:id', Authenticate.admin, function(req, res, next)
    {
        database.executeQuery("DELETE FROM user WHERE user_id = ?", [req.params.id], function(result, error)
        {
            if (error) {
                res.send(500, error);
            } else if (result.affectedRows == 0) {
                res.send(404, "user not found");
            } else {
                res.send("user deleted!");
            }
        })
    })
} 
 
 
module.exports = function (server, database) 
{ 
    return Admin.init(server, database); 
}