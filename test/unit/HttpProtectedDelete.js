const assert             = require('assert');
const mockDatabase       = require('../mocks/database');
const mockAuthnetication = require('../mocks/authentication');
const restifyClient      = require('../helpers/restifyClient');

describe('HTTP Status code Tests for protected DELETE endpoints', function()
{
    before(function(done)
    {
        client = restifyClient.createClient(mockDatabase, mockAuthnetication);
        done();
    });

    describe('/admin/users/:id', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.del('/admin/users/1', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/orders/:order_number/products/:ean_number', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.del('/orders/1/products/1', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/product/:ean_number', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.del('/product/1', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/wishlist/:user_id/:ean_number', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.del('/wishlist/1/1', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/favoritelist/:ean_number', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.del('/favoritelist/1', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    after(function(done)
    {
        client.close();
        restifyClient.destroyClient();

        done();
    });
});