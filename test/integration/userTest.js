const assert             = require('assert');
const fs                 = require('fs');
const databaseHelper     = new(require('../helpers/database'));
const jwtHelper          = require('../../helpers/jwt')(require('crypto'), require('base64url'));
const authenticateHelper = require('../../helpers/authenticateHelper')(databaseHelper, jwtHelper, require('bcrypt-nodejs'));
const restifyClient      = require('../helpers/restifyClient');

describe('Integration tests for user related endpoints', function()
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

    describe('/user/register', function()
    {
        it('should create a account and return a HTTP 200', function(done)
        {
            var user = {
                "e_mail":"test@test.nl",
                "password":"test",
                "first_name":"test",
                "insertion":"test",
                "surname":"test",
                "gender":"male",
                "date_of_birth":"2010-01-01",
                "phone_number":"0612345678",
                "secret_question":"1",
                "secret_question_answer":"test",
                "postal_code":"123AB",
                "number":1,
                "street_name":"test",
                "city":"test"
            }

            client.post('/user/register', user, function (err, req, res, data)
            {
                assert.equal(res.statusCode, 200, 'invalid status code');
                done();
            });
        });
    });

    describe('/user/login', function()
    {
        it('should return a HTTP 200 when successfully login', function(done)
        {
            client.basicAuth("test@test.nl", "test");
            client.get('/user/login', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 200, 'invalid status code');
                done();
            });
        });

        it('should return a HTTP 401 when providing a wrong password', function(done)
        {
            client.basicAuth("test@test.nl", "wrong");
            client.get('/user/login', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });

        it('should return a HTTP 401 when providing a non existing credentials', function(done)
        {
            client.basicAuth("does@notexists.nl", "notexists");
            client.get('/user/login', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 401, 'invalid status code');
                done();
            });
        });

        it('should return a HTTP 403 for blocked users', function(done)
        {
            client.basicAuth("blocked@blocked.nl", "customer");
            client.get('/user/login', function (err, req, res, data)
            {
                assert.equal(res.statusCode, 403, 'invalid status code');
                done();
            });
        });
    });

    describe('/user/resetpassword', function()
    {
        it('should successfully login after password reset', function(done)
        {
            var post = {
                "new_password":"new",
                "repeat_password":"new",
                "email":"test@test.nl",
                "secret_question":1,
                "secret_question_answer":"test"
            }

            client.post('/user/resetpassword', post, function (err, req, res, data)
            {
                client.basicAuth("test@test.nl", "new");
                client.get('/user/login', function (err, req, res, data)
                {
                    assert.equal(res.statusCode, 200, 'invalid status code');
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