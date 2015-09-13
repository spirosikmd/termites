var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var ngAnnotate = require('gulp-ng-annotate');
var webserver = require('gulp-webserver');
var angularTemplateCache = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');
var eslint = require('gulp-eslint');
var gutil = require('gulp-util');
var sass = require('gulp-ruby-sass');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var scsslint = require('gulp-scss-lint');
var addStream = require('add-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');
var browserify = require('browserify');
var Server = require('karma').Server;
var es = require('event-stream');
var argv = require('yargs').argv;
var gif = require('gulp-if');
var rename = require('gulp-rename');
var size = require('gulp-size');

var components = [
  'button'
];

var paths = {
  scripts: ['src/*/js/**/*.js'],
  styles: ['src/*/scss/**/*.scss']
};

var dist = 'dist';

// Delete current dist folder
gulp.task('clean', function () {
  return del([dist]);
});

function templates (component) {
  return gulp.src(['src/' + component + '/templates/**/*.html'])
    .pipe(minifyHTML({conditionals: true, spare: true}))
    .pipe(angularTemplateCache());
}

gulp.task('eslint', function () {
  return gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('scsslint', function () {
  gulp.src(paths.styles)
    .pipe(scsslint());
});

// Browserify, minify and copy all JavaScript
// with sourcemaps all the way down
gulp.task('scripts', function () {
  var tasks = components.map(function (component) {
    var b = browserify({
      entries: './src/' + component + '/js/module.js',
      debug: true
    });

    return b.bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(gif(!argv.production, sourcemaps.init({loadMaps: true})))
        .pipe(ngAnnotate())
        .pipe(gif(argv.production, uglify()))
        .pipe(addStream.obj(templates(component)))
        .pipe(concat('ub.' + component + '.js'))
        .pipe(gif(argv.production, rename({suffix: '.min'})))
        .on('error', gutil.log)
      .pipe(gif(!argv.production, sourcemaps.write()))
      .pipe(size({title: component + '.js.size'}))
      .pipe(gulp.dest(dist + '/components/' + component));
  });

  // create a merged stream
  return es.merge.apply(null, tasks);
});

gulp.task('sass', function () {
  var tasks = components.map(function (component) {
    return sass('src/' + component, {sourcemap: true, style: 'compact'})
      .pipe(gif(!argv.production, sourcemaps.init({loadMaps: true})))
        .pipe(prefix('last 1 version', '> 1%', 'ie 8', 'ie 7'))
        .pipe(gif(argv.production, minifyCSS()))
        .pipe(concat('ub.' + component + '.css'))
        .pipe(gif(argv.production, rename({suffix: '.min'})))
        .on('error', sass.logError)
      .pipe(gif(!argv.production, sourcemaps.write()))
      .pipe(size({title: component + '.scss.size'}))
      .pipe(gulp.dest(dist + '/components/' + component));
  });

  // create a merged stream
  return es.merge.apply(null, tasks);
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch([paths.scripts], ['eslint', 'scripts']);
  gulp.watch([paths.styles], ['scsslint', 'sass']);
});

gulp.task('karma', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('karma:watch', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

// Start a development server
gulp.task('serve', ['clean', 'eslint', 'scripts', 'scsslint', 'sass', 'watch'], function () {
  gulp.src('.')
    .pipe(webserver({
      livereload: true
    }));
});

gulp.task('default', ['clean', 'eslint', 'scripts', 'scsslint', 'sass', 'karma']);
