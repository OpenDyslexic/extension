gulp = require('gulp')
less = require('gulp-less')
gutil = require('gulp-util')
minifyCSS = require('gulp-minify-css')
uglify = require('gulp-uglify')
chalk = require('chalk')
logger = require('gulp-logger')
rename = require('gulp-rename')
coffee = require('gulp-coffee')
concat = require('gulp-concat')

gulp.task 'app_css', ->
  gulp.src([
    'assets/css/vendor/bootstrap.css'
    'assets/css/vendor/icon.css'
    'assets/css/vendor/material.css'
    'assets/css/vendor/ripples.css'
    'assets/css/vendor/default.css'
    ])
    .pipe(minifyCSS(keepSpecialComments: 1))
    .pipe(logger(
        before: 'Compressing Css '
        after: 'Compressing finished!'
        extname: '.min.css'
        showChange: true))
    .pipe(rename(suffix: '.min'))
    .pipe gulp.dest('./assets/dist/css')
  return


gulp.task 'app_fonts', ->
  gulp.src('assets/fonts/*.*')
  .pipe(logger(
    before: 'Moving Fonts '
    after: 'Moving finished!'
    extname: ''
    showChange: true))
  .pipe gulp.dest('./assets/dist/fonts')
  return


gulp.task 'app_scripts', ->
  gulp.src([
    'assets/js/app/core.coffee'
  ])
  .pipe(logger(
    before: 'Starting Compressing Javascript'
    after: 'Compressing complete!'
    extname: '.js'
    showChange: true))
  .pipe(coffee())
  .pipe(concat('app.js'))
  .pipe(rename(suffix: '.min'))
  .pipe gulp.dest('./assets/dist/js/app')
  return

  

gulp.task 'app_system', ->
  gulp.src([
    'assets/js/app/system.coffee'
  ])
  .pipe(logger(
    before: 'Starting Compressing Javascript'
    after: 'Compressing complete!'
    extname: '.js'
    showChange: true))
  .pipe(coffee())
  .pipe(uglify())
  .pipe(concat('system.js'))
  .pipe(rename(suffix: '.min'))
  .pipe gulp.dest('./assets/dist/js/app')
  return

gulp.task 'vendor_scripts', ->
  gulp.src([
    'assets/js/vendor/jquery.js'
    'assets/js/vendor/bootstrap.js'
    'assets/js/vendor/ripples.js'
    'assets/js/vendor/material.js'
    ])
  .pipe(uglify(preserveComments: 'all'))
  .pipe(logger(
    before: 'Starting Compressing Javascript'
    after: 'Compressing complete!'
    extname: '.js'
    showChange: true))
  .pipe(concat('vendor.js'))
  .pipe(rename(suffix: '.min'))
  .pipe gulp.dest('./assets/dist/js/vendor/')
  return


gulp.task 'build', [
  'app_css'
  'app_fonts'
  'app_scripts'
  'app_system'
  'vendor_scripts'
]
gulp.task 'default', [ 'build' ]

