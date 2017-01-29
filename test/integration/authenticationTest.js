const fs                 = require('fs');
const assert             = require('assert');
const databaseHelper     = new(require('../helpers/database'));
const jwtMock            = require('../mocks/jwt');
const authenticateHelper = require('../../helpers/authenticateHelper')(databaseHelper, jwtMock, require('bcrypt-nodejs'));

describe('Authentication Test', function()
{
    before(function(done)
    {
        // Insert test data for the user table
        fs.readFile("test/sql/user.sql", "utf-8", function (err, data)
        {
            databaseHelper.executeQuery(data, [], function(result, error)
            {
                done();
            })
        });
    });

    describe('#authenticate() (Basic Auth)', function(done)
    {
        it('should grand access with correct Basic Authorization', function(done)
        {
            var authorization = {
                "scheme":"Basic",
                "basic" : {
                    "username":"customer@customer.nl",
                    "password":"customer"
                }
            }

            authenticateHelper.authenticate(authorization, "customer", function(success) {
                assert.equal(success, true);
                done();
            })
        });

        it('should deny access with incorrect Basic Authorization', function(done)
        {
            var authorization = {
                "scheme":"Basic",
                "basic" : {
                    "username":"incorrect",
                    "password":"incorrect"
                }
            }

            authenticateHelper.authenticate(authorization, "customer", function(success) {
                assert.equal(success, false);
                done();
            })
        });
    });

    describe('#authenticate() (Bearer)', function(done)
    {
        it('should grand access with correct Bearer usertype', function(done)
        {
            jwtMock.sign({usertype:"customer", iss:1}, function(token)
            {
                var authorization = {
                    "scheme":"Bearer",
                    "credentials":token
                }

                authenticateHelper.authenticate(authorization, "customer", function(success) {
                    assert.equal(success, true);
                    done();
                })
            })
        });

        it('should deney access with incorrect Bearer usertype', function(done)
        {
            jwtMock.sign({usertype:"customer", iss:1}, function(token)
            {
                var authorization = {
                    "scheme":"Bearer",
                    "credentials":token
                }

                authenticateHelper.authenticate(authorization, "admin", function(success) {
                    assert.equal(success, false);
                    done();
                })
            })
        });
    });

    after(function(done)
    {
        databaseHelper.executeQuery("DROP TABLE `user`", [], function(result, error)
        {
            done();
        })
    })
});