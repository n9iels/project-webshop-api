const assert             = require('assert');
const fs                 = require('fs');
const databaseHelper     = new(require('../helpers/database'));
const jwtHelper          = require('../../helpers/jwt')(require('crypto'), require('base64url'));
const authenticateHelper = require('../../helpers/authenticateHelper')(databaseHelper, jwtHelper, require('bcrypt-nodejs'));
const restifyClient      = require('../helpers/restifyClient');

describe('Integration tests for order endpoints', function()
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

    describe('/orders', function()
    {
        it('should create a order and return a HTTP 200', function(done)
        {
            var order = {
                "shipping_method":"deliver",
                "payment_method":"iDEAL",
                "status":"paid",
                "btw_percentage":21,
                "order_date":"2017-01-30T10:23:24.988Z",
                "delivery_costs":3.95,
                "cart":
                [
                    {"ean_number":45665465},
                    {"ean_number":45665465},
                    {"ean_number":9006113007210}
                ]
            }

            client.basicAuth("customer@customer.nl", "customer");
            client.get('/user/login', function (err, req, res, data)
            {
                client.basicAuth(false);
                client.headers.authorization = `Bearer ${data.access_token}`;
                client.post('/orders', order, function (err, req, res, data)
                {
                    assert.equal(res.statusCode, 200, err);
                    done();
                });
            });
        });
    });

    describe('/orders', function()
    {
        it('should return all orders for the user', function(done)
        {
            client.basicAuth("customer@customer.nl", "customer");
            client.get('/user/login', function (err, req, res, data)
            {
                client.basicAuth(false);
                client.headers.authorization = `Bearer ${data.access_token}`;
                client.get('/orders', function (err, req, res, data)
                {
                    assert.equal(data.length, 1, err);
                    done();
                });
            });
        });
    });

    describe('/orders/:order_number', function()
    {
        it('should return all products for a order', function(done)
        {
            client.basicAuth("customer@customer.nl", "customer");
            client.get('/user/login', function (err, req, res, data)
            {
                client.basicAuth(false);
                client.headers.authorization = `Bearer ${data.access_token}`;
                client.get('/orders/1', function (err, req, res, data)
                {
                    assert.equal(data.products.length, 2, "Not all products exists");
                    assert.equal(data.products[0].amount, 2, "Incorrect amount");
                    assert.equal(data.products[1].amount, 1, "Incorrect amount");
                    done();
                });
            });
        });
    });

    after(function()
    {
        client.close();
        restifyClient.destroyClient();
    });
});