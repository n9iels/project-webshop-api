const databaseHelper = require("../../helpers/database");

function Database()
{
    return new databaseHelper({
        host              : '178.62.235.143',
        user              : 'webshop',
        password          : 'HQv@1rM0KUXXjpZw09WE',
        database          : 'webshop-test',
        port              : 3306,
        multipleStatements: true
    });
}

module.exports = Database;