gulp = require 'gulp'
less = require 'gulp-less'
gutil = require 'gulp-util'
minifyCSS = require 'gulp-minify-css'
uglify = require 'gulp-uglify'
chalk = require 'chalk'
logger = require 'gulp-logger'
rename = require 'gulp-rename'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'

gulp.task 'app_css', ->
  gulp.src 'assets/css/**/*'
    .pipe minifyCSS keepSpecialComments: 1
    .pipe rename suffix: '.min'
    .pipe gulp.dest './assets/dist/css'
  return


gulp.task 'app_fonts', ->
  gulp.src 'assets/fonts/*.*'
  .pipe gulp.dest './assets/dist/fonts'
  return


gulp.task 'app_scripts', ->
  gulp.src 'assets/js/app/core.js'
  .pipe concat 'app.js'
  .pipe rename suffix: '.min'
  .pipe gulp.dest './assets/dist/js/app'
  return


gulp.task 'app_system', ->
  gulp.src 'assets/js/app/system.coffee'
  .pipe coffee()
  .pipe uglify()
  .pipe concat 'system.js'
  .pipe rename suffix: '.min'
  .pipe gulp.dest './assets/dist/js/app'
  return

gulp.task 'vendor_scripts', ->
  gulp.src [
    'assets/js/vendor/jquery.js'
    'assets/js/vendor/bootstrap.js'
    'assets/js/vendor/ripples.js'
    'assets/js/vendor/material.js'
    ]
  .pipe uglify preserveComments: 'all'
  .pipe concat 'vendor.js'
  .pipe rename suffix: '.min'
  .pipe gulp.dest './assets/dist/js/vendor/'
  return


gulp.task 'build', [
  'app_css'
  'app_fonts'
  'app_scripts'
  'app_system'
  'vendor_scripts'
]
gulp.task 'default', [ 'build' ]

