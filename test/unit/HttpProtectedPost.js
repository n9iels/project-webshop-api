const assert             = require('assert');
const mockDatabase       = require('../mocks/database');
const mockAuthnetication = require('../mocks/authentication');
const restifyClient      = require('../helpers/restifyClient');

describe('HTTP Status code Tests for protected POST endpoints', function()
{
    before(function(done)
    {
        client = restifyClient.createClient(mockDatabase, mockAuthnetication);
        done();
    });

    describe('/orders', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.post('/orders', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/orders/:order_number/products', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.post('/orders/1/products', function (err, req, res, data)
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
            client.post('/wishlist/1/1', function (err, req, res, data)
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