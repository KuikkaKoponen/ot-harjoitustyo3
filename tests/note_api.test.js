const mongoose = require('mongoose')  // MongoDB
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const helper = require('./test_helper')


// Tietokanta tyhjennetään aluksi ja sen jälkeen kantaan lisätään kaksi taulukkoon initialNotes talletettua muistiinpanoa. Näin testien suoritus aloitetaan aina hallitusti samasta tilasta.
beforeEach(async () => {
// Jotta asynkronisia operaatioita voi kutsua awaitin avulla, niiden täytyy palauttaa promiseja ja täytyy olla async-funktiossa
  // alla olevat jäi vähän epäselviksi miten toimii
  await Note.deleteMany({})

  let noteObject = new Note(helper.initialNotes[0])
  await noteObject.save()

  noteObject = new Note(helper.initialNotes[1])
  await noteObject.save()
})

// Huomioi, että alla olevat testit ovat toteutettu kahdella eri tavalla
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}),

test('there are right amount of blogs', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialNotes.length)
}),

test('the first blog is cy certain author', async () => {
  const response = await api.get('/api/blogs')

  // Jestin toContain-ekspektaatiometodilla tarkistetaan että parametrina oleva muistiinpano on kaikkien API:n palauttamien muistiinpanojen joukossa
  const contents = response.body.map(r => r.title)
  expect(contents).toContain(
    'Blogin nimi nro. kaksi'
  )
})

test('a valid blog can be added ', async () => {
  const newNote = {
    title: 'async/await simplifies making async calls',
    author: 'kirjoittajan nimi',
    url: 'osoite',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb()
  expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

  const contents = notesAtEnd.map(n => n.title)
  expect(contents).toContain(
    'async/await simplifies making async calls'
  )
})

// tämä ei toimi
test('note without content is not added', async () => {
  const newNote = {
    title: 'otsikko'
  }

  await api
    .post('/api/blogs')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(helper.initialNotes.length)

})

test('a specific blog can be viewed', async () => {
  const notesAtStart = await helper.notesInDb()

  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/blogs/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultNote.body).toEqual(noteToView)
})

test('a blog can be deleted', async () => {
  const notesAtStart = await helper.notesInDb()
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/blogs/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await helper.notesInDb()

  expect(notesAtEnd).toHaveLength(
    helper.initialNotes.length - 1
  )

  const contents = notesAtEnd.map(r => r.title)

  expect(contents).not.toContain(noteToDelete.title)
})

afterAll(() => {
  mongoose.connection.close()
})