gulp   = require 'gulp'
coffee = require 'gulp-coffee'
stylus = require 'gulp-stylus'
nib    = require 'nib'
pug    = require 'gulp-pug'
browserSync = require 'browser-sync'
plumber = require 'gulp-plumber'
notify = require 'gulp-notify'

gulp.task 'coffee', ->
  gulp.src 'src/scripts/**/*.coffee'
    .pipe plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
    })
    .pipe coffee()
    .pipe gulp.dest('dist/scripts')

gulp.task 'stylus', ->
  gulp.src 'src/styles/**/[^_]*.styl'
    .pipe stylus
      use: [nib()]
    .pipe gulp.dest('dist/styles')

gulp.task 'pug', ->
  gulp.src 'src/views/**/*.pug'
    .pipe plumber({
        errorHandler: notify.onError("Error: <%= error.message %>")
    })
    .pipe pug({pretty: true})
    .pipe gulp.dest('dist')

gulp.task 'browserSync', ->
  browserSync
    server:
      baseDir: './dist/'
      index: 'index.html'

gulp.task 'reload', ->
  browserSync.reload()

gulp.task 'build', ['pug', 'stylus', 'coffee']
gulp.task 'watch', ->
  gulp.watch ['src/scripts/**/*.coffee'], ->
    gulp.start ['coffee']
  gulp.watch ['src/views/**/*.pug'], ->
    gulp.start ['pug']
  gulp.watch ['src/styles/**/*.styl'], ->
    gulp.start ['stylus']

gulp.task 'default', ['browserSync', 'build', 'watch']
