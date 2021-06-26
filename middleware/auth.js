const jwt = require('jsonwebtoken')

exports.verify = (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization
        const token = bearerToken.substring(7, bearerToken.length)
        
        const user = jwt.verify(token, 'Secret')
        req.user = user
        next()
    } catch (err) {
        res.status(401).send({
            message: 'Unauthorized'
        })
    }
}