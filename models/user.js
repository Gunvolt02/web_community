const mongoose = require('mongoose'); // importo mongoose
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema; // importo la classe schema
const bcrypt = require('bcrypt-nodejs'); // middleware per criptare la password

// funzione che controlla se l'email è valida
let validEmailChecker = (email) => {
  if (!email) {
    return false;
  } else {
      // regular expression per le mail
      const regExp = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      return regExp.test(email);
  }
}

// funzione che controlla la luncghezza dell'email
let emailLenghtChecker = (email) => {
  if (!email) {
    return false;
  } else {
    if (email.length > 30 || email.length < 5) {
      return false;
    }
  }
  return true;
}

// funzione che controlla se lo username è valido
let validUsernameChecker = (username) => {
  if (!username) {
    return false;
  } else {
      // regular expression per gli username
      const regExp = new RegExp(/^(?=[a-zA-Z0-9._]{2,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/);
      return regExp.test(username);
  }
}

// funzione che controlla la luncghezza dello username
let usernameLenghtChecker = (username) => {
  if (!username) {
    return false;
  } else {
    if (username.length > 20 || username.length < 2) {
      return false;
    }
  }
  return true;
}

// funzione che controlla se la password è valida
let validpasswordChecker = (password) => {
  if (!password) {
    return false;
  } else {
      // regular expression per la password
      const regExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/);
      return regExp.test(password);
  }
}

// funzione che controlla la luncghezza della password
let passwordLenghtChecker = (password) => {
  if (!password) {
    return false;
  } else {
    if (password.length < 8) {
      return false;
    }
  }
  return true;
}

// array contenenti i messaggi di errore personalizzati
const emailValidators = [{
  validator: emailLenghtChecker,
  message: 'Deve essere di lunghezza tra i 5 e i 30 caratteri'
},
{
  validator: validEmailChecker,
  message: 'Email non valida'
}];

const usernameValidators = [{
  validator: usernameLenghtChecker,
  message: 'Deve essere di lunghezza tra i 2 e i 20 caratteri'
},
{
  validator: validUsernameChecker,
  message: 'Username non valido'
}];

const nameValidators = [{
  validator: usernameLenghtChecker,
  message: 'Deve essere di lunghezza tra i 2 e i 20 caratteri'
},
{
  validator: validUsernameChecker,
  message: 'Nome non valido'
}];

const surnameValidators = [{
  validator: usernameLenghtChecker,
  message: 'Deve essere di lunghezza tra i 2 e i 20 caratteri'
},
{
  validator: validUsernameChecker,
  message: 'Cognome non valido'
}];

const passwordValidators = [{
  validator: passwordLenghtChecker,
  message: 'La password deve essere di almeno 8 caratteri'
},
{
  validator: validpasswordChecker,
  message: 'La password deve avere almeno una maiuscola, una minuscola, un carattere speciale e un numero'
}];

const userSchema = new Schema({ // definisco il mio modello
  email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
  username: { type: String, required: true, unique: true, validate: usernameValidators},
  nome: { type: String, required: true, validate: nameValidators},
  cognome: { type: String, required: true, validate: surnameValidators},
  password: { type: String, required: true, validate: passwordValidators},
});

// funzione per criptare la password lanciata prima di salvare ogni volta che viene utilizzato questo modello
userSchema.pre('save', function(next) {
  if(!this.isModified('password')) // controlla se la password non è cambiata
    return next;
  else {
    bcrypt.hash(this.password, null, null, (err, hash) => { // fa l'hashing della password
      if(err) {
        return next(err); // mostra eventuali errori
      }
      this.password = hash; // imposta la versione criptata della password
      next(); // esce dal middleware
  });
  }
});

// metodo che confronta se la password inserita è uguale a quella nel db
userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', userSchema); // lo esporto come 'User'
