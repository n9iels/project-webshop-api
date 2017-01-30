const assert             = require('assert');
const mockDatabase       = require('../mocks/database');
const mockAuthnetication = require('../mocks/authentication');
const restifyClient      = require('../helpers/restifyClient');

describe('HTTP Status code Tests for protected PATCH endpoints', function()
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
            client.patch('/admin/users/1', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/orders/:order_number', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.patch('/orders/1', function (err, req, res, data)
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
            client.patch('/product/1', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/wishlist/switch_public', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.patch('/wishlist/switch_public', function (err, req, res, data)
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