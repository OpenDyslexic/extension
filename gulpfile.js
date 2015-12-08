var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync');
var jshint = require('gulp-jshint');
var gutil = require('gulp-util');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var chalk = require('chalk');


gulp.task('css', function () {
    gulp.src('assets/css/*/*.css')
        .pipe(minifyCSS({keepSpecialComments: 1})
        .pipe(gulp.dest('./assets/dist/css'));
})

gulp.task('fonts', function () {
    gulp.src('assets/fonts/*')
        .pipe(minifyCSS({keepSpecialComments: 1})
        .pipe(gulp.dest('./assets/dist/fonts'));
})

gulp.task('scripts', function () {
    gulp.src('assets/js/*/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('./assets/dist/js'));
})


gulp.task('build', ['less','scripts']);


gulp.task('default', ['build']);