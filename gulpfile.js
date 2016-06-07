var gulp = require('gulp')
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('concatJs', function() {
    return gulp.src('./src/*.js')
        .pipe(concat('gridstack-angular.js'))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('compress',['concatJs'],function() {
    return gulp.src('dist/gridstack-angular.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['compress']);