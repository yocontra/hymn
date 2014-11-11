'use strict';

var http = require('http');
var path = require('path');

var gulp = require('gulp');
var stylus = require('gulp-stylus');
var nib = require('nib');
var autoprefix = require('autoprefixer-stylus');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var lr = require('gulp-livereload');
var cached = require('gulp-cached');
var deploy = require('gulp-gh-pages');
var gif = require('gulp-if');

var merge = require('merge-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var ecstatic = require('ecstatic');

var paths = {
  js: 'src/**/*.js',
  static: ['samples/sandbox/src/**/*', '!samples/sandbox/**/*.js'],
  soundcloud: ['samples/soundcloud/src/**/*', '!samples/soundcloud/**/*.js']
};

var bundleCache = {};
var pkgCache = {};

var bundler = watchify(browserify('./src/index.js', {
  cache: bundleCache,
  packageCache: pkgCache,
  fullPaths: true,
  standalone: 'hymn',
  debug: true
}));

var sampleBundler = watchify(browserify('./samples/sandbox/src/index.js', {
  cache: bundleCache,
  packageCache: pkgCache,
  fullPaths: true,
  standalone: 'sample',
  debug: true
}));

var soundcloudBundler = watchify(browserify('./samples/soundcloud/src/index.js', {
  cache: bundleCache,
  packageCache: pkgCache,
  fullPaths: true,
  standalone: 'soundcloud',
  debug: true
}));

gulp.task('watch', function(){
  bundler.on('update', function(){
    gulp.start('js');
  });
  sampleBundler.on('update', function(){
    gulp.start('samples');
  });
  soundcloudBundler.on('update', function(){
    gulp.start('soundcloud');
  });
  gulp.watch(paths.static, ['static']);
  gulp.watch(paths.soundcloud, ['soundcloud-static']);
});

gulp.task('js', function(){
  var browserifyStream = bundler.bundle()
    // browserify -> gulp transfer
    .pipe(source('hymn.js'))
    .pipe(buffer())
    .pipe(cached('js'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));

  var lintStream = gulp.src(paths.js)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));

  return merge(browserifyStream, lintStream);
});

gulp.task('samples', function(){
  return sampleBundler.bundle()
    // browserify -> gulp transfer
    .pipe(source('sample.js'))
    .pipe(buffer())
    .pipe(cached('samples'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('samples/sandbox/dist'))
    .pipe(lr());
});

gulp.task('soundcloud', function(){
  return soundcloudBundler.bundle()
    // browserify -> gulp transfer
    .pipe(source('sample.js'))
    .pipe(buffer())
    .pipe(cached('samples'))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('samples/soundcloud/dist'))
    .pipe(lr());
});

gulp.task('static', function(){
  return gulp.src(paths.static)
    .pipe(cached('static-samples'))
    .pipe(gif('*.styl', stylus({
      use: [
        nib(),
        autoprefix()
      ]
    })))
    .pipe(gulp.dest('samples/sandbox/dist'))
    .pipe(lr());
});

gulp.task('soundcloud-static', function(){
  return gulp.src(paths.soundcloud)
    .pipe(cached('static-soundcloud'))
    .pipe(gif('*.styl', stylus({
      use: [
        nib(),
        autoprefix()
      ]
    })))
    .pipe(gulp.dest('samples/soundcloud/dist'))
    .pipe(lr());
});

gulp.task('sample-server', function(cb){
  var port = parseInt(process.env.PORT) || 9090;
  var rootFolder = path.join(__dirname, './samples/sandbox/dist');
  var server = http.createServer(ecstatic({root: rootFolder}));
  server.listen(port, cb);
});

gulp.task('deploy', function(){
  return gulp.src('./samples/sandbox/dist/**/*')
    .pipe(deploy());
});

gulp.task('default', ['js', 'samples', 'static', 'soundcloud', 'soundcloud-static', 'sample-server', 'watch']);
