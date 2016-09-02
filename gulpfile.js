const gulp = require('gulp');
const apidoc = require('gulp-apidoc');

gulp.task('apidoc', function(done){
  apidoc({
    src: "./controllers/",
    dest: "../../blog/public/weibo",
    config: "./"
  }, done);
});
