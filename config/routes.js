var home = require('../app/controllers/home');
var login = require('../app/controllers/login');

  module.exports = function (app){
  app.get('/', home.home);
  app.get('/home', home.home);
  app.get('/login', login.login);

  //Buy Energy
  app.post('/sell',home.sell);
 }
