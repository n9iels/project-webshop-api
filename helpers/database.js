// Require the MySQL and fileWrite module
var mysql = require('mysql');
var fs    = require('fs');

/**
 * Database Contructor
 *
 * @return {void}
 */
function Database() {
    this._pool = mysql.createPool({
        host              : '84.84.245.29',
        user              : 'webshop',
        password          : 'HQv@1rM0KUXXjpZw09WE',
        database          : 'webshop',
        port              : 1686,
        multipleStatements: true
    });
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
                fs.appendFile("./log/error.log", "Error when execute query '" + sql + "'\n" + error.message + "\n\n");
                console.error('error when execute query: ' + error.message);
            }

            callback(results, error);
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