function Router () {
  var fs = require('fs');
  this.routes.join(fs.readdirSync(this.dir));
  return this;
}

Router.prototype.dir = './routes';

Router.prototype.routes = [];

Router.prototype.register = function(app) {
  for (var i = 0; i < this.routes.length; i++) {
    require(this.dir + routes[i])(app);
  }
  return this;
};

module.exports = Router;