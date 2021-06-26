const express = require('express')
const router = express.Router()
const db = require('../utils/db')
const jwt = require('../utils/jwt')
const crypto = require('crypto')

router.post('/register', (req, res) => {
    db.serialize(() => {
        db.get('SELECT username FROM user WHERE username = ?', [req.body.username], (err, row) => {
            if (row) {
                res.status(409).json({ 'message': 'Username already taken' })
            } else {
                db.run('INSERT INTO user(username, password) VALUES(?,?)', [req.body.username, crypto.createHash('sha256').update(req.body.password).digest('base64')], (err) => {
                    if (err) {
                        res.status(400).json({ 'message': err.message })
                    }
                })

                db.get('select last_insert_rowid() as id FROM user', (err, row) => {
                    res.status(200).json({
                        id: row['id'],
                        access_token: jwt.GenerateToken(req.body.username, row['id'])
                    })
                })
            }
        })
    })
})

router.post('/login', (req, res) => {
    db.serialize(() => {
        db.get('SELECT * FROM user WHERE username = ?', [req.body.username], (err, row) => {
            if (row) {
                if (crypto.createHash('sha256').update(req.body.password).digest('base64') == row['password']) {
                    res.status(200).json({
                        id: row['id'],
                        access_token: jwt.GenerateToken(req.body.username, row['id'])
                    })
                } else {
                    res.status(400).json({
                        message: 'Wrong Password'
                    })
                }
            } else {
                res.status(400).json({
                    message: 'username not found'
                })
            }
        })
    })
})


module.exports = router