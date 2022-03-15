//----------------------- code du serveur amélioré, plus stable pour le déploiement (copie openclassrooms) -----------------------// 

// import package http de node
const http = require('http');
// import de l'application
const app = require('./app');
// import fichier config
const config = require('./config.js');


// Affichage de l'environnement de developpement
console.log(`NODE_ENV=${config.NODE_ENV}`);

// Fonction qui renvoie un port valide, qu'il soit fourni sous forme d'un numéro ou d'une chaine
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(config.PORT);
app.set('port', port);

// Fonction qui recherche les différentes erreurs et les résoud
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

//Intégration de l'application express au serveur
const server = http.createServer(app);

// Consigne du port sur lequel le serveur s'exécute dans la console
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});


server.listen(port);

