var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    cssnano = require('gulp-cssnano'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');


// start local server
// ------------------------------------
gulp.task('start', function() {
  browserSync.init(['**/*.css', 'js/*.js', '**/*.html'], {
    server: './',
    port: 51723,
    browser: ['opera']
  });
});


// minify css
// ------------------------------------
gulp.task('css-minify', function() {
  gulp.src('css/*.css')
      .pipe(plumber())
      .pipe(cssnano({discardComments: {removeAll: true}}))
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('css'));
});


// minify js
// ------------------------------------
gulp.task('js-minify', function() {
  gulp.src('js/*.js')
      .pipe(plumber())
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('js'));
});
