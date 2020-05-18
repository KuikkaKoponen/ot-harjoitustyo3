// note.js sisältää nyt ainoastaan muistiinpanojen skeeman määrittelyn.

const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5
  },
  author: {
    type: String,
    required: true,
    minlength: 5
  },
  url: {
    type: String,
    required: true,
    minlength: 5
  },
  likes: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    // Mongoosen populate-funktion toiminnallisuus perustuu siihen, että olemme määritelleet viitteiden "tyypit" olioiden Mongoose-skeemaan ref-kentän avulla
    ref: 'User'
  }
})


noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// tässä määritetellään et menee mongooseen Note taulukkoon
module.exports = mongoose.model('Note', noteSchema)