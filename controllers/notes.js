// täällä luodaan uusi blogi/note

const notesRouter = require('express').Router() // luodaan Router olio
const Note = require('../models/note')  // Voisi olla myös blog nimellä
const User = require('../models/user') // Tuodaan User olio tänne
const jwt = require('jsonwebtoken')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes.map(note => note.toJSON()))
})

// Routerin avulla osoitteet voidaan typistää
notesRouter.get('/:id', async (request, response, next) => {
  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note.toJSON())
  } else {
    response.status(404).end()
  }
})

// toimii
notesRouter.post('/', async (request, response, next) => {
  const body = request.body
  let likes = 0
  //const user = await User.findById(body.userId) // etsitään oikea user

  if (Object.prototype.hasOwnProperty.call(body, 'likes') && body.likes.length > 0 ) {
    likes = body.likes
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET) // request.token on middlewaresta
  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = await User.findById(decodedToken.id)

  const note = new Note({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: likes,
    user: user._id
  })

  const savedNote = await note.save() // tallentaa noten, jossa mukana user id
  user.notes = user.notes.concat(savedNote._id) // kopiodaan vanhat userin notet ja talletetaan luodun muistiinpanon id
  await user.save()

  response.json(savedNote.toJSON())
})

// toimii
notesRouter.delete('/:id', async (request, response, next) => {

  const decodedToken = jwt.verify(request.token, process.env.SECRET) // request.token on middlewaresta
  console.log(decodedToken)

  const blog = await Note.findById(request.params.id)
  
  if (!request.token || !decodedToken.id || decodedToken.id.toString() !== blog.user.toString() ) {
    return response.status(401).json({ error: 'only own blogs can be deleted or token missing or invalid' })
  }

  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// toimii
notesRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const note = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }
  const resp = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(resp.toJSON())
})

module.exports = notesRouter