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
var addStream = require('add-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var del = require('del');
var browserify = require('browserify');

var paths = {
  scripts: ['src/**/*.js'],
  templates: ['src/templates/**/*.html']
};
var dist = 'dist';

// Delete current dist folder
gulp.task('clean', function () {
  return del([dist]);
});

function templates () {
  return gulp.src(paths.templates)
    .pipe(minifyHTML({conditionals: true, spare: true}))
    .pipe(angularTemplateCache());
}

gulp.task('lint', function () {
  return gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

// Browserify, minify and copy all JavaScript
// with sourcemaps all the way down
gulp.task('scripts', ['clean', 'lint'], function () {
  var b = browserify({
    entries: './src/module.js',
    debug: true
  });

  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(addStream.obj(templates()))
      .pipe(concat('usabilla.modules.min.js'))
      .on('error', gutil.log)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dist));
});

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts']);
});

// Start a development server
gulp.task('webserver', ['scripts', 'watch'], function () {
  gulp.src('.')
    .pipe(webserver({
      livereload: true
    }));
});

gulp.task('default', ['scripts', 'watch']);
