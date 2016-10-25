var Authenticate = {};

Authenticate.check = function(req, res, next)
{
    console.log("check the user level");
    next();
}

module.exports = Authenticate;