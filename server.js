'use strict';

/**
 * Module dependencies.
 */
console.log('[%s]\nSystem started. Initializing system parameters.', new Date()) 

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var Db = require('./lib/Db.js');
var FS = require('fs');
var app = module.exports = express();
var pkg = require('./package');
var Router = require('./lib/Router.js');

app.db = new Db();

app.configure(function(){
  app.set('env', 'development')
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    store: new MongoStore({
      url: app.db.mongourl
    }),
    secret: 'actrl'
  }));
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/public'));
});
  
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
var router = new Router().register(app);

app.listen(process.env.VCAP_APP_PORT || 80, function(){
  console.log("[%s]\nSFEI Systems ACTRL OPS operating on port %d in %s mode. ", new Date(), process.env.VCAP_APP_PORT || 80, app.settings.env);
});