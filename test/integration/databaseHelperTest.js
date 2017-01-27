const assert        = require('assert');
const databaseHelper = require("../../helpers/database");

describe('DatabaseHelper Tests', function()
{
    before(function(done)
    {
        database = new databaseHelper({
            host              : '178.62.235.143',
            user              : 'webshop',
            password          : 'HQv@1rM0KUXXjpZw09WE',
            database          : 'webshop-test',
            port              : 3306,
            multipleStatements: true
        });
        
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