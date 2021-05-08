const mongoose = require('mongoose'); // importo mongoose
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema; // importo la classe schema

// funzione che controlla se l'email è valida
let validTitleChecker = (title) => {
  if (!title) {
    return false;
  } else {
      // regular expression per le mail
      const regExp = new RegExp(/^[a-zA-Z0-9 _]*$/);
      return regExp.test(title);
  }
}

// funzione che controlla la luncghezza dell'email
let titleLenghtChecker = (title) => {
  if (!title) {
    return false;
  } else {
    if (title.length > 80 || title.length < 5) {
      return false;
    }
  }
  return true;
}

// funzione che controlla la luncghezza dello username
let bodyLenghtChecker = (body) => {
  if (!body) {
    return false;
  } else {
    if (body.length > 5000 || body.length < 10) {
      return false;
    }
  }
  return true;
}

// funzione che controlla la luncghezza della password
let commentLenghtChecker = (comment) => {
  if (!comment[0]) {
    return false;
  } else {
    if (comment[0].length > 200 || comment[0].length < 2) {
      return false;
    }
  }
  return true;
}

// array contenenti i messaggi di errore personalizzati
const titleValidators = [{
  validator: titleLenghtChecker,
  message: 'Deve essere di lunghezza tra i 5 e gli 80 caratteri'
},
{
  validator: validTitleChecker,
  message: 'titolo non valida'
}];

const bodyValidators = [{
  validator: bodyLenghtChecker,
  message: 'Consentiti massimo 5000 caratteri'
}];

const commentValidators = [{
  validator: commentLenghtChecker,
  message: 'Deve essere di lunghezza tra i 2 e i 200 caratteri'
}];

const blogSchema = new Schema({
  title: {type: String, required: true, validate: titleValidators},
  body: {type: String, required: true, validate: bodyValidators},
  author: {type: String},
  data: {type: Date, default: Date.now()},
  five: {type: Number, default: 0},
  five_author: {type: Array},
  one: {type: Number, default: 0},
  one_author: {type: Array},
  comments: [{
    comment: {type: String, validate: commentValidators},
    comment_author: {type: String}
  }]
});

module.exports = mongoose.model('Blog', blogSchema); // lo esporto come 'User'
