// requires
var http = require('http');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var connect = require('connect');

// constants
var PORT = +process.env.PORT || 9292;
var HOST = process.env.HOST || '0.0.0.0';

// main
var app = connect()
  .use(connect.logger('dev'))
  .use(connect.static(__dirname + '/..'));
app.listen(PORT, HOST);
console.log('listening on '+HOST+':'+PORT);

run_make_test();
'src test Makefile package.json'.split(' ').forEach(function(filename) {
  recursivelyWatch(filename, run_make_test);
});

// functions
function recursivelyWatch(watchee, cb) {
  fs.readdir(watchee, function(err, files) {
    if (err) { // not a directory, just watch it
      fs.watch(watchee, cb);
    }
    else { // a directory, recurse, also watch for files being added or deleted
      files.forEach(recurse);
      fs.watch(watchee, function() {
        fs.readdir(watchee, function(err, filesNew) {
          if (err) return; // watchee may have been deleted
          // filesNew - files = new files or dirs to watch
          filesNew.filter(function(file) { return files.indexOf(file) < 0; })
          .forEach(recurse);
          files = filesNew;
        });
        cb();
      });
    }
    function recurse(file) { recursivelyWatch(path.join(watchee, file), cb); }
  });
}


var q;
function enqueueOrDo(cb) { q ? q.push(cb) : cb(); }
function run_make_test() {
  if (q) return;
  q = [];
  console.log('[%s]\nmake test', (new Date).toISOString());
  var make_test = child_process.exec('make test', { env: process.env });
  make_test.stdout.pipe(process.stdout, { end: false });
  make_test.stderr.pipe(process.stderr, { end: false });
  make_test.on('exit', function(code) {
    if (code) console.error('Exit Code ' + code);
    for (var i = 0; i < q.length; i += 1) q[i]();
    q = undefined;
  });
}
