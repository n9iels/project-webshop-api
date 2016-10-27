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
        user     : 'webshop',
        password : 'HQv@1rM0KUXXjpZw09WE',
        database : 'webshop',
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
Database.prototype.executeQuery = function (sql, params, callback)
{
    this._connection.query(sql, params, function(err, rows, fields) {
        if (err) {
            fs.appendFile("./log/error.log", err.message + "\n");
            console.error('error when execute query: ' + err.message);
        }

        callback(rows);
    });
}

module.exports = Database;