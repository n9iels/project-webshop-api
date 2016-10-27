// Require the MySQL and fileWrite module
var mysql = require('mysql');
var fs    = require('fs');

/**
* Database Contructor
*
* @return {void}
*/
function Database() {
    this._connection = mysql.createConnection({
        host     : '84.84.245.29',
        user     : 'dev_assignment1',
        password : 'Oz6A76w83HZe',
        database : 'development_assignment1',
        port:    1686
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
            fs.appendFile("./log/error.log", err.message + "\n");
            console.error('error when execute query: ' + err.message);
        }

        return callback(rows);
    });
}

module.exports = Database;