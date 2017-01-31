const assert             = require('assert');
const fs                 = require('fs');
const databaseHelper     = new(require('../helpers/database'));
const jwtHelper          = require('../../helpers/jwt')(require('crypto'), require('base64url'));
const authenticateHelper = require('../../helpers/authenticateHelper')(databaseHelper, jwtHelper, require('bcrypt-nodejs'));
const restifyClient      = require('../helpers/restifyClient');

describe('Integration tests for user related endpoints', function()
{
    before(function(done)
    {
        client = restifyClient.createClient(databaseHelper, authenticateHelper);

         // Insert test data for the user table
        fs.readFile("test/sql/schema.sql", "utf-8", function (err, data)
        {
            databaseHelper.executeQuery(data, [], function(result, error)
            {
                done();
            })
        });
    });

    describe('/products', function()
    {
        it('should return 10 products by default', function(done)
        {
            client.get('/products', function (err, req, res, data)
            {
                assert.equal(data.data.length, 10);
                done();
            });
        });
    });

    describe('/products?page=2', function()
    {
        it('should return less then 10 products on the last page', function(done)
        {
            client.get('/products?page=2', function (err, req, res, data)
            {
                assert.equal(data.data.length, 2);
                done();
            });
        });
    });


    after(function()
    {
        client.close();
        restifyClient.destroyClient();
    });
});