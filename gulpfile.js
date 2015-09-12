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
gulp.task('scripts', ['clean', 'eslint'], function () {
  var tasks = components.map(function (component) {
    var b = browserify({
      entries: [
        './src/' + component + '/js/module.js'
      ],
      debug: true
    });

    return b.bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(ngAnnotate())
        .pipe(uglify())
        .pipe(addStream.obj(templates(component)))
        .pipe(concat('ub.' + component + '.min.js'))
        .on('error', gutil.log)
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(dist + '/components/' + component));
  });

  // create a merged stream
  return es.merge.apply(null, tasks);
});

gulp.task('scripts:production', ['eslint'], function () {
  var tasks = components.map(function (component) {
    var b = browserify({
      entries: './src/' + component + '/js/module.js'
    });

    return b.bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(ngAnnotate())
      .pipe(addStream.obj(templates(component)))
      .pipe(uglify())
      .pipe(concat('ub.' + component + '.min.js'))
      .on('error', gutil.log)
      .pipe(gulp.dest(dist + '/components/' + component));
  });

  // create a merged stream
  return es.merge.apply(null, tasks);
});

gulp.task('sass', ['scsslint'], function () {
  var tasks = components.map(function (component) {
    return sass('src/' + component, {sourcemap: true, style: 'compact'})
      .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(prefix('last 1 version', '> 1%', 'ie 8', 'ie 7'))
        .pipe(minifyCSS())
        .pipe(concat('ub.' + component + '.min.css'))
        .on('error', sass.logError)
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(dist + '/components/' + component));
  });

  // create a merged stream
  return es.merge.apply(null, tasks);
});

gulp.task('sass:production', ['scsslint'], function () {
  var tasks = components.map(function (component) {
    return sass('src/' + component, {style: 'compact'})
      .pipe(prefix('last 1 version', '> 1%', 'ie 8', 'ie 7'))
      .pipe(minifyCSS())
      .pipe(concat('ub.' + component + '.min.css'))
      .on('error', sass.logError)
      .pipe(gulp.dest(dist + '/components/' + component));
  });

  // create a merged stream
  return es.merge.apply(null, tasks);
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch([paths.scripts, paths.styles], ['scripts', 'sass']);
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
gulp.task('serve', ['scripts', 'sass', 'watch'], function () {
  gulp.src('.')
    .pipe(webserver({
      livereload: true
    }));
});

gulp.task('build', ['clean', 'karma', 'scripts:production', 'sass:production']);

gulp.task('default', ['scripts', 'sass', 'karma']);
