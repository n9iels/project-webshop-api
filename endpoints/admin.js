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
        req.body.password = Authenticate.hash(req.body.password);
        
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

    server.post('admin/new_game', Authenticate.admin, function(req, res, next)
    {
        try
        {
            var post = JSON.parse(req.body);
            console.log(post);

            var publisher = post.publisher;
            var title = post.title;
            var subtitle = post.subtitle;
            var genre = post.genre;
            var franchise = post.franchise;
            var description = post.description;
            var ean_number = post.ean_number;
            var platform = post.platform;
            var release_date = post.release_date;
            var pegi_age = post.pegi_age;
            var stock = post.stock;
            var price = post.price;
            var image = post.image;
        }
        catch (err)
        {
            res.send(422, "Missing fields")
        }


        database.executeQuery("INSERT INTO platform_independent_info(pi_id, publisher, title, subtitle, genre, franchise, description) VALUES (NULL, ?, ?, ?, ?, ?, ?)", 
        [publisher, title, subtitle, genre, franchise, description], function(result, error)
        {
            if (error)
            {
                res.send(500, error)
            }
            else
            {
                database.executeQuery("INSERT INTO game(ean_number, platform, release_date, pegi_age, stock, price, image, pi_id) VALUES (?, ?, ?, ?, ?, ?, ?, (SELECT MAX(pi_id) FROM platform_independent_info WHERE title = ?))", 
                [ean_number, platform, release_date, pegi_age, stock, price, image, title], function(result, error)
                {
                    if (error)
                    {
                        res.send(500, error)
                    }
                    else
                    {
                        res.send("Inserted info into table game");
                    }
                })
            }
        })
    })
} 
 
 
module.exports = function (server, database) 
{ 
    return Admin.init(server, database); 
}