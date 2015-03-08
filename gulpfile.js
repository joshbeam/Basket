var gulp = require('gulp');

// plugins
var sass = require('gulp-sass');

gulp.task('sass',function() {
	return gulp.src('src/styles/style.scss')
			.pipe(sass())
			.pipe(gulp.dest('src/styles'));
});

gulp.task('watch',function() {
	gulp.watch('src/styles/style.scss',['sass']);
});

gulp.task('default',['sass','watch']);