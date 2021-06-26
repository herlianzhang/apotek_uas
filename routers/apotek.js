const { json } = require('body-parser')
const express = require('express')
const router = express.Router()

const { verify } = require('../middleware/auth')
const db = require('../utils/db')

router.get('/', verify, (req, res) => {
    const userId = req.user['id']
    db.serialize(() => {
        db.all('SELECT * FROM apotek WHERE creator_id = ?', [userId], (err, data) => {
            if (err) {
                res.status(400).json({
                    'message': err.message
                })
            }
            res.status(200).json({
                data
            })
        })
    })
})

router.post('/', verify, (req, res) => {
    const userId = req.user['id']

    db.serialize(() => {
        db.run('INSERT INTO apotek(name,desc,stock,price,creator_id) VALUES (?,?,?,?,?)', [req.body.name, req.body.desc, req.body.stock, req.body.price, userId], (err) => {
            if (err) {
                res.status(400).json({ 'message': err.message })
            }

            db.get('SELECT last_insert_rowid() as id', (err, row) => {
                res.status(200).json({
                    id: row['id'],
                    name: req.body.name,
                    desc: req.body.desc,
                    stock: req.body.stock,
                    price: req.body.price,
                    userId: userId
                })
            })
        })
    })
})

router.put('/:id', verify, (req, res) => {
    const userId = req.user['id']
    db.serialize(() => {
        db.get('SELECT * FROM apotek WHERE id = ?', [req.params.id], (err, row) => {
            if (err) {
                res.status(400).json({
                    'message': err.message
                })
            }
            if (row['creator_id'] == userId) {
                db.run('UPDATE apotek SET name = ?, desc = ?, stock = ?, price = ? WHERE id = ?', [req.body.name || row['name'], req.body.desc || row['desc'], req.body.stock || row['stock'], req.body.price || row['price'], req.params.id], (err) => {
                    if (err) {
                        res.status(400).json({
                            'message': err.message
                        })
                    }

                    db.get('SELECT * FROM apotek WHERE id = ?', [req.params.id], (err, data) => {
                        res.status(200).json({ data })
                    })
                })
            } else {
                res.status(401).json({
                    'message': 'it\'s not your privilege to change data'
                })
            }
        })
    })
})

router.delete('/:id', verify, (req, res) => {
    const userId = req.user['id']
    db.serialize(() => {
        db.get('SELECT * FROM apotek WHERE id = ?', [req.params.id], (err, row) => {
            if (err) {
                res.status(400).json({
                    'message': err.message
                })
            }
            if (row['creator_id'] == userId) {
                db.run('DELETE FROM apotek WHERE id = ?', [req.params.id], (err) => {
                    if (err) {
                        res.status(400).json({
                            'message': err.message
                        })
                    }
                    res.status(200).json({
                        'message': `Success delete with id ${req.params.id}` 
                    })
                })
            } else {
                res.status(401).json({
                    'message': 'it\'s not your privilege to change data'
                })
            }
        })
    })
})

module.exports = router