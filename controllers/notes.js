const notesRouter = require('express').Router() // luodaan Router olio
const Note = require('../models/note')  // Voisi olla myös blog nimellä
const listHelper = require('./utils/list_helper')  //  Eristetään apufunktiot omaan moduliinsa

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes.map(note => note.toJSON()))
  })
})

// Routerin avulla osoitteet voidaan typistää
notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote.toJSON())
    })
    .catch(error => next(error))
})

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const body = request.body

  const note = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))
})

module.exports = notesRouter