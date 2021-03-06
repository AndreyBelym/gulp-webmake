var through2 = require('through2');
var webmake = require('@belym.a.2105/webmake');
var util = require('util');
var PluginError = require('plugin-error');


module.exports = function(options) {
  var defaultOptions = {};
  options = util._extend(defaultOptions, options || {});

  return through2.obj(function(file, enc, next) {
    var self = this;

    if (file.isNull()) {
      self.push(file);
      return next();
    }

    if (file.isStream()) {
      self.emit('error', new PluginError('gulp-webmake', 'Streaming not supported.'));
      return next();
    }

    webmake(file.path, options, function(err, content) {
      if (err) {
        self.emit('error', new PluginError('gulp-webmake', err, { showStack : true }));
      } else {
        file.contents = new Buffer(content);
        file.extname = '.js';
        self.push(file);
      }
      next();
    });
  });
};
