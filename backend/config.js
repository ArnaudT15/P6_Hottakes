//----------------------- Config dot.env -----------------------// 

// Import de dotenv
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

// Export pour retrouver les valeurs contenues dans le fichier .env
module.exports = {
    NODE_ENV : process.env.NODE_ENV || 'dev',
    JWT_TOKEN : process.env.JWT_TOKEN,
    MONGO_DB_HOST : process.env.MONGO_DB_HOST,
    MONGO_DB_USERNAME : process.env.MONGO_DB_USERNAME,
    MONGO_DB_PASSWORD : process.env.MONGO_DB_PASSWORD,
    MONGO_DB_NAME : process.env.MONGO_DB_NAME,
    HOST : process.env.HOST || 'localhost',
    PORT : process.env.PORT || 3000
}