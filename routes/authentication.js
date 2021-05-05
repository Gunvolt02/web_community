const bodyParser = require('body-parser'); // middleware per il parsing del body ottenuto come post
const jsonParser = bodyParser.json(); // parsing per il formato json
const urlencodedParser  = bodyParser.urlencoded({ extended: true }); // parsing per le form

const User = require('../models/user'); // importo il modello per l'utente

// funzione da eseguire quando è esportato (ogni qualvolta ci sia da autorizzare)
module.exports = (router) => {
  router.post('/register', urlencodedParser, (req, res) => { // invio tramite post alla route register e controllo che ci siano tutti i dati
    if (!req.body.email) {
      res.json({success: false, message: 'Devi inserire un email'});
    } else {
        if(!req.body.username) {
          res.json({success: false, message: 'Devi inserire uno username'});
        } else {
            if(!req.body.nome) {
              res.json({success: false, message: 'Devi inserire il nome'});
            } else {
                if(!req.body.cognome) {
                  res.json({success: false, message: 'Devi inserire il cognome'});
                } else {
                    if(!req.body.password) {
                      res.json({success: false, message: 'Devi inserire una password'});
                    } else {
                      // creo un nuovo utente (in formato JSON siccome andrà inserito nel DB mongodb)
                      let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username,
                        nome: req.body.nome,
                        cognome: req.body.cognome,
                        password: req.body.password
                      });
                      user.save((err) => {
                        if(err) {
                          if(err.code === 11000) {  // codice di errore di mongodb in caso di valori unici duplicati
                            res.json({ success: false, message: 'Username o email già in uso'});
                          } else if (err.errors) {
                              if (err.errors.email) {
                                res.json({success: false, message: err.errors.email.message}); // errore fornito dal validator da me implementato
                              } else if (err.errors.username) {
                                res.json({success: false, message: err.errors.username.message}); // errore fornito dal validator da me implementato
                              } else if (err.errors.nome) {
                                res.json({success: false, message: err.errors.nome.message}); // errore fornito dal validator da me implementato
                              } else if (err.errors.cognome) {
                                res.json({success: false, message: err.errors.cognome.message}); // errore fornito dal validator da me implementato
                              }
                              else if (err.errors.password) {
                                res.json({success: false, message: err.errors.password.message}); // errore fornito dal validator da me implementato
                              }
                          }
                          else {
                            res.json({ success: false, message: 'Non è stato possibile salvare le informazioni [errore] -> ', err});
                          }
                        } else {
                          res.json({success: true, message: 'Utente registrato con successo'});
                        }
                      });
                    }
                  }
                }
              }
    }
  });
  return router;
}
