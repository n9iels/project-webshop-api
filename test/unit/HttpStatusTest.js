const assert        = require('assert');
const restifyClient = require('../helpers/restifyClient')

describe('HTTP Status code Tests for public endpoints', function()
{
    before(function(done)
    {
        client = restifyClient.createClient();
        done();
    });

    describe('/products', function()
    {
        it('should return a HTTP 200', function(done)
        {
            client.get('/products', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 200, 'invalid status code');
                done();
            });
        });
    });

    describe('/products/:ean_number', function()
    {
        it('should return a HTTP 200', function(done)
        {
            client.get('/products', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 200, 'invalid status code');
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