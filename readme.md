# gulp-concat-limit v0.0.3 [![Build Status](https://travis-ci.org/adam-lynch/gulp-concat-limit.png)](https://travis-ci.org/adam-lynch/gulp-concat-limit)

## Information

<table>
<tr> 
<td>Package</td><td>gulp-concat-limit</td>
</tr>
<tr>
<td>Description</td>
<td>Concatenates files into as few files as possible without exceeding a given length limit</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.8</td>
</tr>
</table>

## Install
```js
npm install gulp-concat-limit
```

## Example usage with [Gulp](http://github.com/gulpjs/gulp)

```js
var gulp = require('gulp');
var concat = require('gulp-concat-limit');

gulp.task('concat', function() {
    gulp.src('./css/*.css')
        .pipe(concat('style-', 256))//2KB
        .pipe(gulp.dest('./combinedCSS'));
});

gulp.task('default', ['concat']);

// Rerun the task when a file changes
gulp.task('watch', function () {
  gulp.watch('./css/*.css', ['concat']);
});
```

## Parameters

**fileName** (required) string
**sizeLimit** (optional) number, defaults to 25600 (200KB)
**options** (optional); options.newLine (optional) boolean, defaults to false