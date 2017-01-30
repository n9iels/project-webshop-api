const assert             = require('assert');
const mockDatabase       = require('../mocks/database');
const mockAuthnetication = require('../mocks/authentication');
const restifyClient      = require('../helpers/restifyClient');

describe('HTTP Status code Tests for protected GET endpoints', function()
{
    before(function(done)
    {
        client = restifyClient.createClient(mockDatabase, mockAuthnetication);
        done();
    });

    describe('/user', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.get('/user', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/users', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.get('/users', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/admin/users', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.get('/admin/users', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/admin/users/:id', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.get('/admin/users/1', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/orders', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.get('/orders', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/orders/:id', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.get('/orders/1', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/wishlist', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.get('/wishlist', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/wishlist', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.get('/wishlist', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/public_wishlist/:user_id', function()
    {
        it('should return a HTTP 200', function(done)
        {
            client.get('/public_wishlist/1', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 200, 'invalid status code');
                done();
            });
        });
    });

    describe('/stats/topgames', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.get('/stats/topgames', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });
    });

    describe('/favoritelist', function()
    {
        it('should return a HTTP 401', function(done)
        {
            client.get('/favoritelist', function (err, req, res, data)
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