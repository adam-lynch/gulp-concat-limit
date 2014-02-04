# combine-css v0.0.2 [![Build Status](https://travis-ci.org/adam-lynch/combine-css.png)](https://travis-ci.org/adam-lynch/combine-css)

## Information

<table>
<tr> 
<td>Package</td><td>combine-css</td>
</tr>
<tr>
<td>Description</td>
<td>Combines CSS files into as few files as possible, taking size and selector limits into account</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.8</td>
</tr>
</table>

## Example usage with [Gulp](http://github.com/gulpjs/gulp)

```js
var gulp = require('gulp');
var combineCSS = require('combine-css');

gulp.task('combine', function() {
    gulp.src('./css/*.css')
        .pipe(combineCSS({
            lengthLimit: 256,//2KB
            prefix: '_m-',
            selectorLimit: 4080
        }))
        .pipe(gulp.dest('./combinedCSS'));
});

gulp.task('default', ['combine']);

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch('./css/*.css', ['combine']);
});
```