var home = require('../app/controllers/home');
var login = require('../app/controllers/login');

  module.exports = function (app){
  app.get('/', home.home);
  app.get('/home', home.home);
  app.get('/login', login.login);
  
  //Get request to logout as we are just deleting the session
  app.get('/logout',login.logout);

  app.post('/login', login.check);

  //Buy Energy
  app.post('/sell',home.sell);
 }
