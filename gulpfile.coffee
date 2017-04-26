gulp = require('gulp')
less = require('gulp-less')
gutil = require('gulp-util')
minifyCSS = require('gulp-minify-css')
uglify = require('gulp-uglify')
chalk = require('chalk')
logger = require('gulp-logger')
rename = require('gulp-rename')
coffee = require('gulp-coffee')

gulp.task 'app_css', ->
  gulp.src([
    'assets/css/*/*'
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
  gulp.src('assets/js/app/*.coffee')
  .pipe(uglify(preserveComments: 'all'))
  .pipe(logger(
    before: 'Starting Compressing Javascript'
    after: 'Compressing complete!'
    extname: '.js'
    showChange: true))
  .pipe(coffee())
  .pipe(rename(suffix: '.min'))
  .pipe gulp.dest('./assets/dist/js/app')
  return


gulp.task 'vendor_scripts', ->
  gulp.src('assets/js/vendor/*')
  .pipe(uglify(preserveComments: 'all'))
  .pipe(logger(
    before: 'Starting Compressing Javascript'
    after: 'Compressing complete!'
    extname: '.js'
    showChange: true))
  .pipe(rename(suffix: '.min'))
  .pipe gulp.dest('./assets/dist/js/vendor')
  return


gulp.task 'build', [
  'app_css'
  'app_fonts'
  'app_scripts'
  'vendor_scripts'
]
gulp.task 'default', [ 'build' ]

