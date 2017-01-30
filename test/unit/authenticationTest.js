const fs                 = require('fs');
const assert             = require('assert');
const databaseMock       = require('../mocks/database');
const jwt                = require('../../helpers/jwt');
const authenticateHelper = require('../../helpers/authenticateHelper')(databaseMock, jwt, require('bcrypt-nodejs'));

describe('Authentication Test', function()
{
    describe('#authenticate()', function()
    {
        it('should grand access with correct Bearer usertype', function(done)
        {
            authenticateHelper.generateToken([{"user_id":1, "user_type":"customer"}], function(token)
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
            authenticateHelper.generateToken([{"user_id":1, "user_type":"customer"}], function(token)
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
});