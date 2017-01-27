// DatabaseHelper mock object
function Database() {};

Database.prototype.executeQuery = function(sql, params, callback)
{
    callback([{it:"works"}]);
}

Database.prototype.escape = function(value)
{
    return value;
}

module.exports = new Database();