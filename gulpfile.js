var gulp            = require('gulp'),
    bower		    = require('gulp-bower'),
    sequence	    = require('gulp-sequence'),
    concat		    = require('gulp-concat'),
    uglify		    = require('gulp-uglify');

gulp.task('bower', function()
{
    return bower({
        cmd: 'update',
        interactive: true
    });
});


gulp.task('ugly', function ()
{
	return gulp.src(
    [
        './src/branding.js'
    ])
	.pipe(concat('lib.min.js'))
	.pipe(uglify({
        preserveComments: 'license',
        compress: { hoist_funs: false }
    }))
	.pipe(gulp.dest('./dist'));
});


gulp.task('watch', function ()
{
    gulp.watch('./src/**')
        .on('change', ['ugly']);
});


gulp.task('default', function(callback)
{
    sequence('bower', 'ugly')(callback)
});