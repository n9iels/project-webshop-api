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

    after(function(done)
    {
        client.close();
        restifyClient.destroyClient();

        done();
    });
});