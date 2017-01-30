const assert         = require('assert');
const databaseHelper = require("../helpers/database");

describe('DatabaseHelper Tests', function()
{
    before(function(done)
    {
        database = new databaseHelper();
        done();
    });

    describe('#executeQuery()', function(done)
    {
        it('should execute a SQL query without errors', function(done)
        {
            database.executeQuery("SELECT 1", [], function(result, error)
            {
                assert.equal(error, null);
                done();
            });
        });
    });

    describe('#excape()', function()
    {
        it('should return a escaped string', function()
        {
            assert.equal(database.escape("It's you're problem!"), "'It\\'s you\\'re problem!'");
        })
    })
});