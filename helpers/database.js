// Require the MySQL module
var mysql = require('mysql');

/**
* Database Contructor
*
* @return {void}
*/
function Database() {
    this._connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'dev_assignment1',
        password : 'Oz6A76w83HZe',
        database : 'development_assignment1'
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
Database.prototype.executeQuery = function (sql, callback)
{
    this._connection.query(sql, function(err, rows, fields) {
        if (err) {
            console.error('error when execute query: ' + err.message);
            return;
        }

        return callback(rows);
    });
}

module.exports = Database;