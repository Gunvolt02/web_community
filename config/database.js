// genera una sequenza di byte casuali con il modulo crypto di node.js
const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = { // per esportare il file quando richiesto
  uri: 'mongodb+srv://Lorenzo:Bowser2002@meanapp.y53of.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  secret: crypto, // codice interno segreto utilizzato per varie autenticazioni (db, token, ecc..)
  db: 'web_community'
}
