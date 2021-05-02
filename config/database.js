// genera una sequenza di byte casuali con il modulo crypto di node.js
const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = { // per esportare il file quando richiesto
  uri: 'mongodb://localhost:27017/' + this.db,
  secret: crypto, // codice interno segreto utilizzato per varie autenticazioni (db, token, ecc..)
  db: 'web_community'
}
