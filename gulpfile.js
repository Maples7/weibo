const gulp = require('gulp');
const raml2html = require('gulp-raml2html');

gulp.task('apidoc', function() {
  return gulp.src('./api_doc/weibo-api.raml')
    .pipe(raml2html())
    .pipe(gulp.dest('./api_doc/build'));
});