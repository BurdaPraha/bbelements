var gulp            = require('gulp'),
    sequence	    = require('gulp-sequence'),
    concat		    = require('gulp-concat'),
    uglify		    = require('gulp-uglify');

    
gulp.task('ugly', function ()
{
	return gulp.src(["./src/branding.js"])
	.pipe(concat('lib.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('./dist'));
});


gulp.task('watch', function ()
{
    gulp.watch('./src/**')
        .on('change', ['ugly']);
});


gulp.task('default', function(callback)
{
    sequence('ugly')(callback)
});