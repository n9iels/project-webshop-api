// Require the MySQL and fileWrite module
var mysql = require('mysql');

/**
 * Database Contructor
 *
 * @return {void}
 */
function Database(credentials)
{
    if (credentials == undefined)
    {
        credentials = {
            host              : '178.62.235.143',
            user              : 'webshop',
            password          : 'HQv@1rM0KUXXjpZw09WE',
            database          : 'webshop',
            port              : 3306,
            multipleStatements: true
        }
    }

    this._pool = mysql.createPool(credentials);
}

/**
 * Execute a SQL query
 *
 * @method executeQuery
 * @param {string}   sql       Sql query to execute
 * @param {function} callback  Callback function used to return the result of the query 
 *
 * @return {void}
 */
Database.prototype.executeQuery = function (sql, params, callback)
{
    this._pool.getConnection(function(err, connection)
    {
        connection.query(sql, params, function (error, results, fields)
        {
            connection.release();
            
            if (error) {
                console.error('error when execute query: ' + error.message);
            }

            callback(results, error, fields);
        });
    });
}

/**
 * Escape a value to use it in SQL
 * 
 * @method escape
 * @param {string}  value  Value to escape
 * 
 * @return {string}
 */
Database.prototype.escape = function (value)
{
    return this._pool.escape(value);
}

module.exports = Database;
