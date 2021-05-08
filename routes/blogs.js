const bodyParser = require('body-parser'); // middleware per il parsing del body ottenuto come post
const jsonParser = bodyParser.json(); // parsing per il formato json
const urlencodedParser  = bodyParser.urlencoded({ extended: true }); // parsing per le form
const jwt = require('jsonwebtoken'); // importo il modulo jwt per l'autorizzazione
const config = require('../config/database.js');

const Blog = require('../models/blog'); // importo il modello per il blog

module.exports = (router) => {

  router.post('/newBlog', jsonParser, (req, res) => {
    if (!req.body.title) {
      res.json({success: false, message: 'Devi inserire un titolo'});
      console.log(req.body.title);
    } else {
      if (!req.body.body) {
        res.json({success: false, message: 'Devi inserire una recensione'});
      } else {
        if (!req.body.author) {
          res.json({success: false, message: 'Devi inserire il tuo username'});
        } else {
          const blog = new Blog ({
            title: req.body.title,
            body: req.body.body,
            author: req.body.author,
          });
          blog.save((err) => {
            if (err) {
              if (err.errors.title) {
                res.json({success: false, message: err.errors.title.message});
              } else if (err.errors.body) {
                  res.json({success: false, message: err.errors.body.message});
                } else {
                  res.json({success: false, message: err});
                }
              } else {
                res.json({success: true, message: 'Recensione postata con successo'});
              }
          });
        }
      }
    }
  });

  return router;
}
