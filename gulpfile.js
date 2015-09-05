var gulp = require('gulp');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var newer = require('gulp-newer');
var ngAnnotate = require('gulp-ng-annotate');
var webserver = require('gulp-webserver');
var angularTemplateCache = require('gulp-angular-templatecache');
var minifyHTML = require('gulp-minify-html');
var eslint = require('gulp-eslint');
var addStream = require('add-stream');
var del = require('del');

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

// Minify and copy all JavaScript
// with sourcemaps all the way down
gulp.task('scripts', ['clean', 'lint'], function () {
  return gulp.src(paths.scripts)
    .pipe(changed(dist))
    .pipe(newer(dist))
    .pipe(sourcemaps.init())
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(addStream.obj(templates()))
      .pipe(concat('usabilla.modules.min.js'))
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
      livereload: true,
      open: true
    }));
});

gulp.task('default', ['scripts', 'watch']);
