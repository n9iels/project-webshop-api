const fs             = require('fs');
const assert         = require('assert');
const databaseHelper = require("../helpers/database");

describe('Authentication Test', function()
{
    before(function(done)
    {
        database = new databaseHelper();

        // Insert test data for the user table
        fs.readFile("test/sql/user.sql", "utf-8", function (err, data)
        {
            database.executeQuery(data, [], function(result, error)
            {
                done();
            })
        });
    });

    describe('#authorize()', function(done)
    {
        it('', function(done)
        {
            database.executeQuery("SELECT 1", [], function(result, error)
            {
                assert.equal(error, null);
                done();
            });
        });
    });

});