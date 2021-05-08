const bodyParser = require('body-parser'); // middleware per il parsing del body ottenuto come post
const jsonParser = bodyParser.json(); // parsing per il formato json
const urlencodedParser  = bodyParser.urlencoded({ extended: true }); // parsing per le form
const jwt = require('jsonwebtoken'); // importo il modulo jwt per l'autorizzazione
const config = require('../config/database.js');

const User = require('../models/user'); // importo il modello per l'utente

// funzione da eseguire quando è esportato (ogni qualvolta ci sia da autorizzare)
module.exports = (router) => {
  router.post('/register', jsonParser, (req, res) => { // invio tramite post alla route register e controllo che ci siano tutti i dati
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

  // per controllare se l'email esiste già
  router.get('checkEmail/:email', (req, res) => {
    if (!req.params.email) {
      res.json({success: false, message: 'email non presente'});
    } else {
      User.findOne({email: req.params.email}, (err, user) => {
        if (err) {
          res.json({success: false, message: err});
        } else {
          if (user) {
            res.json({success: false, message: 'email già in uso'});
          } else {
            res.json({success: true, message: 'email disponibile'});
          }
        }
      });
    }
  } );

  // per controllare se lo username esiste già
  router.get('checkUsername/:username', (req, res) => {
    if (!req.params.username) {
      res.json({success: false, message: 'username non presente'});
      console.log({success: false, message: 'username non presente'});
    } else {
      User.findOne({username: req.params.username}, (err, user) => {
        if (err) {
          res.json({success: false, message: err});
          console.log({success: false, message: err});
        } else {
          if (user) {
            res.json({success: false, message: 'username già in uso'});
            console.log({success: false, message: 'username già in uso'});
          } else {
            res.json({success: true, message: 'username disponibile'});
            console.log({success: false, message: 'username disponibile'});
          }
        }
      });
    }
  } );

  router.post('/login', jsonParser, (req, res) => {
    if (!req.body.username) {
      res.json({success: false, message: 'Nessun username'});
      console.log(req.body.username);
    } else {
      if (!req.body.password) {
        res.json({success: false, message: 'Nessuna password'});
      } else {
        User.findOne({ username: req.body.username.toLowerCase()}, (err, user) => {
          if (err) {
            res.json({success: false, message: err});
          } else {
            if(!user) {
              res.json({success: false, message: 'username non trovato'});
            } else {
              const validPassword = user.comparePassword(req.body.password);
              if (!validPassword) {
                res.json({success: false, message: 'password errata'});
              } else {
                const token = jwt.sign({userId: user._id}, config.secret, { expiresIn: '24h' });
                res.json({success: true, message: 'Login effettuato', token: token, user: { username: user.username, }});
              }
            }
          }
        });
      }
    }
  });

  // per interpretare le richieste che presentano questo determinato header
  // le pagine che hanno bisogno di un'autenticazione (quindi aver fatto il login) andranno tutte dopo questa funzione
  router.use((req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      res.json({success: false, message: 'Nessuna autenticazione fornita'}); // controlla se esiste il token (preso dall'header)
      console.log('io ho ' + req.headers['authorization']);
    } else {
      jwt.verify(token, config.secret, (err, decoded) => { // verifica che sia corretto decriptandolo
        if (err) {
          res.json({success: false, message: 'autenticazione non riuscita: ', err});
        } else {
          req.decoded = decoded;
          next();
        }
      });
    }
  });

  router.get('/profile', (req, res) => {
    User.findOne({ _id: req.decoded.userId}).select('username email nome cognome').exec((err, user) => { // prende dal database username email nome e cognome dello user con quell'id
      if (err) {
        res.json({success: false, message: err});
      } else {
        if (!user) {
          res.json({success: false, message: 'Utente non trovato'});
        } else {
          res.json({success: true, user: user});
        }
      }
    });
  });

  return router;
}
