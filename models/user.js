const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator') // plugari jonka avulla ei voi tallentaan samaa käyttäjää kahdesti
/// TÄNNE VIEL JOKU PLUGARI ET SALASANA RIITTÄVÄN PITKÄ JNE.

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      //Mongoosen populate-funktion toiminnallisuus perustuu siihen, että olemme määritelleet viitteiden "tyypit" olioiden Mongoose-skeemaan ref-kentän avulla
      ref: 'Note'
    }
  ],
})

userSchema.plugin(uniqueValidator)

// tässä voi muokata mongodb:ltä palautuvan "olion" tietoja/muotoa
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

// tässä määritetellään et menee mongooseen User taulukkoon
const User = mongoose.model('User', userSchema)

module.exports = User