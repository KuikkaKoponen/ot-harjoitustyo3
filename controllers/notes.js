const notesRouter = require('express').Router() // luodaan Router olio
const Note = require('../models/note')  // Voisi olla myös blog nimellä

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
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

  if (Object.prototype.hasOwnProperty.call(body, 'likes') && body.likes.length > 0 ) {
    likes = body.likes
  }
  const note = new Note({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: likes,
  })

  const savedNote = await note.save()
  response.json(savedNote.toJSON())

})

// toimii
notesRouter.delete('/:id', async (request, response, next) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

// ei korjattu
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