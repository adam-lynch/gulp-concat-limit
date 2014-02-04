var gulp = require('gulp');
var cssCombiner = require('./index.js');

gulp.task('combine', function() {
    gulp.src('./css/*.css')
        .pipe(cssCombiner({
            lengthLimit: 256,//2KB
            prefix: '_m-',
            selectorLimit: 4080
        }))
        .pipe(gulp.dest('./combinedCSS'));
});

gulp.task('default', ['combine']);