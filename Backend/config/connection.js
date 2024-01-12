const pgPromise = require('pg-promise')
const path = require('path');
const fs = require('fs');

const config = {
    host: "csoft-sei-db.postgres.database.azure.com",
    user: "dilacrush",
    password: "rafa1234*",
    database: "pizza",
    port: 5432,
    ssl: {
        ca: fs.readFileSync(path.resolve(__dirname, 'Ca_cert.pem'))
    }
}

const pgp = pgPromise({})
const db = pgp(config)

exports.db = db