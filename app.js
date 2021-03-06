const config = require('./utils/config')  // Ympäristömuuttujien käsittely on eriytetty tänne
const express = require('express')
require('express-async-errors')  // tämän tuoman magian avulla ei tarvita try catch lauseita
const app = express()
const cors = require('cors')  // Liittyi käytettyihin eri portteihin
const notesRouter = require('./controllers/notes')  // kaikki muistiinpanoihin liittyvien reittien määrittelyt on tänne
const middleware = require('./utils/middleware')  // Itse toteutettujen middlewarejen määritelty on siirretty tänne
const logger = require('./utils/logger')  //  Eristetään kaikki konsoliin tulostelu omaan moduliinsa
const mongoose = require('mongoose')  // MongoDB
const usersRouter = require('./controllers/users') // Hoitaa user routet
const loginRouter = require('./controllers/login') // login

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)
app.use('/api/blogs', notesRouter) // Näin määrittelemäämme routeria käytetään jos polun alkuosa on /api/blogs.
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



module.exports = app