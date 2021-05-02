const express = require('express');  // prendo il package del framework express
const app = express(); // lo inizializzo e lo assegno alla costante app che rappresenta la mia applicazione
const mongoose = require('mongoose'); // prendo il package di mongoose
const config = require('./config/database'); // prendo le informazioni per il database da me create
const path = require('path');

mongoose.Promise = global.Promise; // configurazione di setup generale per evitare alcuni warning
// si connette al database
mongoose.connect(config.uri, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if (err) {
    console.log('Connessione col database fallita: ', err);
  } else {
    console.log('Password generata casualmente: ' + config.secret);
    console.log('Connessione col database riuscita: ' + config.db);
  }
});

// prende il file che è stato creato con Angular
app.use(express.static(__dirname + '/client/dist/client'));

// nel caso in cui riceva una richiesta (req) GET (HTTP) in una qualsiasi (*) route rispondo (res) con questa funzione (operatore freccia =>)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+ '/client/dist/client/index.html'));
})

// metto in ascolto il server sulla porta 8080
app.listen(8080, () => {
  console.log('In ascolto');
});
