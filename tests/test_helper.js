const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    title: 'Blogin nimi',
    author: 'Jukka Hallila',
    url: 'www.osoite.com',
    likes: 5,
  },
  {
    title: 'Blogin nimi nro. kaksi',
    author: 'Pekka Hallila',
    url: 'www.osoite2.com',
    likes: 100,
  },
]

const nonExistingId = async () => {
  const note = new Note({ title: 'willremovethissoon' })
  await note.save()
  await note.remove()

  return note._id.toString()
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialNotes,
  nonExistingId,
  notesInDb,
  usersInDb
}