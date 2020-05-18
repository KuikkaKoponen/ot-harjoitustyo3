// täällä luodaan uusi käyttäjä

const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const body = request.body
  if (request.body.password.length < 4) {
    return response.status(401).json({ error: 'Password too short (min. 3 char.' })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', { title: 1, author: 1, url: 1, likes: 1 })  // Populaten parametri määrittelee, että user-dokumenttien notes-kentässä olevat note-olioihin viittaavat id:t korvataan niitä vastaavilla dokumenteilla. Etsii autom. tietokannasta nämä
  response.json(users.map(u => u.toJSON()))
})

module.exports = usersRouter