const express = require('express');  // prendo il package del framework express
const app = express(); // lo inizializzo e lo assegno alla costante app che rappresenta la mia applicazione
const router = express.Router(); // importo la classe Router da Express che fa da middleware
const mongoose = require('mongoose'); // prendo il package di mongoose
const config = require('./config/database'); // prendo le informazioni per il database da me create
const path = require('path'); // package per i path di sistema
const authentication = require('./routes/authentication') (router); // prendo il backend per l'autenticazione da me creata
const cors = require('cors'); // middleware per abilitare il Cross-origin resource sharing (condividere le risorse tra backend e frontend in quanto sono su porte diverse) disabilitato di default

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

// middleware

app.use(cors({
  origin: 'http://localhost:4200' // permette cors solo sulla porta 4200
}));
app.use(express.static(__dirname + '/client/dist/client')); // imposto la directory in cui è presente il frontend creato con Angular
app.use('/authentication', authentication); // inserisco il backend da me importato in precedenza

// nel caso in cui riceva una richiesta (req) GET (HTTP) in una qualsiasi (*) route rispondo (res) con questa funzione (operatore freccia =>)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+ '/client/dist/client/index.html'));
})

// metto in ascolto il server sulla porta 8080
app.listen(8080, () => {
  console.log('In ascolto');
});
