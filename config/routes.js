var home = require('../app/controllers/home');
var login = require('../app/controllers/login');
var battery = require('../app/controllers/battery');

  module.exports = function (app){
  app.get('/', home.home);
  app.get('/home', home.home);
  app.get('/login', login.login);
  app.get('/bills',home.bills);
  app.get('/power_transfer',battery.current_transfer);

  //Get request to logout as we are just deleting the session
  app.get('/logout',login.logout);

  app.post('/login', login.check);

  //Sell Energy
  app.post('/sell',home.sell);

  //Buy Energy
  app.post('/buy',home.buy);
 }
