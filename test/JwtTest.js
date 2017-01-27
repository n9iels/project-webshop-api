const assert = require('assert');
var jwt      = require('../helpers/jwt')(require('crypto'), require('base64url'));

describe('JSON Web Token Tests', function()
{
    describe('#urlEncode()', function()
    {
        it('should return a valid base64 encoded string', function()
        {
            assert.equal(jwt.urlEncode("az-games"), "YXotZ2FtZXM");
        });
    });

    describe("#createSignature()", function()
    {
        it('should return a SH256 secret hased signature', function()
        {
            assert.equal(jwt.createSignature("az-games"), "87fac8e82aa6069e64020ef9f7e1c67bebae111aa30231ae7951fc07ec8203fd");
        });
    });

    describe("#sign(), #verify()", function()
    {
        it('should return a valid JSON Web Token that can be verified by the #verify() function', function()
        {
            jwt.sign({iss:1}, function(token)
            {
                jwt.verify(token, function(success)
                {
                    assert.equal(success, true);
                });
            });
        })
    });

    describe("#decode()", function()
    {
        var jtwToken = "";

        before(function()
        {
            jwt.sign({iss:1}, function(token) {
                jwtToken = token;
            });
        });

        it('should decode a JWT to valid JSON', function() {
            assert.doesNotThrow(
                () => {},
                jwt.decode(jwtToken)
            );
        });
    });
});