var gulp = require("gulp");
var cleanCSS = require("gulp-clean-css");
var minifyHTML = require('gulp-minify-html');
var uglify = require('gulp-uglify');
var pump = require('pump');

gulp.task("minify-css", function() {
    return gulp.src("*.css")
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest("dist"));
});
gulp.task('minify-html', function() {
    var opts = {comments:true,spare:true};
    
  gulp.src('*.html')
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest('dist'))
});
gulp.task("minify-js", function() {
    gulp.src("*js")
        .pipe(uglify())
        .pipe(gulp.dest("dist"));
});
gulp.task('minify-js', function (cb) {
    pump([
          gulp.src('*.js'),
          uglify(),
          gulp.dest('dist')
      ],
      cb
    );
  });