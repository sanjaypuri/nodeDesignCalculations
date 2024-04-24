const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./designCalculations.db');
module.exports = db;