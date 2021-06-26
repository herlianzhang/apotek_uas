const sqlite = require('sqlite3').verbose()
const path = require('path')
const dbPath = path.resolve(__dirname, '../DB/apotek.db')

const db = new sqlite.Database(dbPath, (err) => {
    if (err) {
        console.log('database connection fail', err)
    } else {
        console.log('success connect database')
        db.run('CREATE TABLE IF NOT EXISTS apotek(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, desc TEXT, stock int, price int, creator_id int)')
        db.run('CREATE TABLE IF NOT EXISTS user(id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT)')
    }
})

module.exports = db