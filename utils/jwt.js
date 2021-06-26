const jwt = require('jsonwebtoken')

module.exports.GenerateToken = (username, id) => {
    return jwt.sign({
        id: id,
        username: username,
    }, "Secret", { expiresIn: '7d' })
}