const express = require('express')
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const userRouter = require('./routers/user')
const apotekRouter = require('./routers/apotek')

app.use('/user', userRouter)
app.use('/apotek', apotekRouter)

app.listen(port, () => {
    console.log(`Server Starting on Port ${port}`)
})