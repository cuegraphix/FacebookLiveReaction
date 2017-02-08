import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'

require('babel-register');

const $ = gulpLoadPlugins()

gulp.task('browserSync', () => {
  $.browserSync({
    server: {
      baseDir: './',
      index: 'index.html'
    }
  });
});
gulp.task('reload', () => {
  s.browserSync.reload();
});

gulp.task('scripts', () =>
  gulp.src('src/scripts/**/*.js')
    .pipe($.babel())
    .pipe(gulp.dest('./dist/scripts'))
);

gulp.task('styles', () =>
  gulp.src('src/styles/**/*.styl')
    .pipe($.stylus())
    .pipe(gulp.dest('./dist/css'))
);

gulp.task('views', () =>
  gulp.src('src/views/**/*.pug')
    .pipe($.pug())
    .pipe(gulp.dest('./dist'))
);

function compile(watch) {
  var bundler = s.watchify(s.browserify('./scripts/main.js', { debug: true }).transform(babelify, {presets: ["es2015", "react"]}));

  function rebundle() {
    bundler.bundle()
      .on('error', function(err) { console.error(err); this.emit('end'); })
      .pipe(source('build.js'))
      .pipe(gulp.dest('./build'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('bundling js...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
};

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', () => {
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/styles/**/*.styl', ['styles']);
  gulp.watch('src/views/**/*.pug', ['views']);
  gulp.watch('./index.html',  ['reload']);
});