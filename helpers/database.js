var mysql = require('mysql');

function Database() {
    this._connection = mysql.createConnection({
        host     : '84.84.245.29',
        user     : 'dev_assignment1',
        password : 'Oz6A76w83HZe',
        database : 'development_assignment1',
        port     : 1686
    });
}

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