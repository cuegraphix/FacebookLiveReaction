import gulp from 'gulp';
import browserSync from 'browser-sync';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';

function compile(watch) {
  var bundler = browserify('./src/scripts/main.js', { debug: true }).transform(babelify, {presets: ["es2015"]});

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

gulp.task('browserSync', () => {
  browserSync({
    server: {
      baseDir: './',
      index: 'index.html'
    }
  });
});

gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('default', ['browserSync','watch'], () => {
  gulp.watch('./index.html',  ['reload']);
  gulp.watch('./scripts/*.*', ['reload']);
  gulp.watch('./build/build.js', ['reload']);
  gulp.watch('./styles/*.*', ['reload']);
});