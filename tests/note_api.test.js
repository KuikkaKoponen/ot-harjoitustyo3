const mongoose = require('mongoose')  // MongoDB
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const helper = require('./test_helper')



// Tietokanta tyhjennetään aluksi ja sen jälkeen kantaan lisätään kaksi taulukkoon initialNotes talletettua muistiinpanoa. Näin testien suoritus aloitetaan aina hallitusti samasta tilasta.
beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialNotes)
})

/* Tapa 2
beforeEach(async () => {
  await Note.deleteMany({})

  const noteObjects = helper.initialNotes
    .map(note => new Note(note)) // Note on mongoose olio
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray) // Tällä saadaan await savet hoidetaan ennen kuin mennään testeihin
  // Metodin Promise.all avulla saadaan koostettua taulukollinen promiseja yhdeksi promiseksi, joka valmistuu, eli menee tilaan fulfilled kun kaikki sen parametrina olevan taulukon promiset ovat valmistuneet. Siispä viimeinen rivi, await Promise.all(promiseArray) odottaa, että kaikki tietokantaan talletetusta vastaavat promiset ovat valmiina, eli alkiot on talletettu tietokantaan.
})
*/

/* Tapa 3. Jos taulukon kaikki promiset pitää olla samassa järjestyksessä kuin taulukossa niin voitaisiin tehdä näin
beforeEach(async () => {
  await Note.deleteMany({})

  for (let note of initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
*/

// Huomioi, että alla olevat testit ovat toteutettu kahdella eri tavalla
//Testaa, että sovellus palauttaa JSON-muotoisia blogeja
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}),

// Testaa, että sovellus palauttaa oikean määrän blogeja
test('there are right amount of blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body).toHaveLength(helper.initialNotes.length)
}),

test('the first blog is by certain author', async () => {
  const response = await api.get('/api/blogs')
  // Jestin toContain-ekspektaatiometodilla tarkistetaan että parametrina oleva muistiinpano on kaikkien API:n palauttamien muistiinpanojen joukossa
  const contents = response.body.map(r => r.title)
  expect(contents).toContain(
    'Blogin nimi nro. kaksi'
  )
})

test('there is field: id', async () => {
  const response = await api.get('/api/blogs')
  const contents = response.body
  expect(contents[0].id).toBeDefined()
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

test('a blog with no empty likes value is 0 ', async () => {
  const newNote = {
    title: 'no likes value',
    author: 'kirjoittajan nimi',
    url: 'osoite',
    likes: ''
  }

  await api
    .post('/api/blogs')
    .send(newNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await helper.notesInDb()
  const contents = notesAtEnd.filter(n => n.title === 'no likes value')
  expect(contents[0].likes).toEqual(0)
})

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

test('title and url needed ', async () => {
  const newNote1 = {
    author: 'kirjoittajan nimi',
    url: 'osoite',
    likes: 5,
  }

  const newNote2 = {
    title: 'async/await simplifies making async calls',
    author: 'kirjoittajan nimi',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .send(newNote1)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  await api
    .post('/api/blogs')
    .send(newNote2)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})