function Router () {
  var fs = require('fs');
  this.routes = this.routes.concat((fs.readdirSync(this.dir)));
  return this;
}

Router.prototype.dir = './routes';

Router.prototype.routes = [];

Router.prototype.register = function(app) {
  for (var i = 0; i < this.routes.length; i++) {
    require('.' + this.dir + '/' + this.routes[i])(app);
  }
  return this;
};

module.exports = Router;