var gulp = require('gulp');

// plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlreplace = require('gulp-html-replace');
var stripDebug = require('gulp-strip-debug');

gulp.task('sass',function() {
	return gulp.src('src/styles/style.scss')
			.pipe(sass())
			.pipe(gulp.dest('src/styles'))
			.pipe(gulp.dest('dist/styles'));
});

gulp.task('scripts',function() {
	return gulp.src(['bower_components/jquery-2.1.3.min/index.js','bower_components/angular/angular.js','bower_components/angular-route/angular-route.js','src/scripts/app/basket/*.js','src/scripts/app/state-manager/*.js','src/scripts/app/helpers/*.js','src/scripts/app/context-menu/*.js','src/scripts/app/people/*.js','src/scripts/app/items/*.js','src/scripts/app/lists/*.js'])
		.pipe(concat('scripts.js'))
		.pipe(stripDebug())
		.pipe(gulp.dest('dist/scripts'))
		.pipe(rename('scripts.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/scripts'));
});

gulp.task('html',function() {
	return gulp.src('index.html')
		.pipe(htmlreplace({
			'js':'scripts/scripts.min.js',
			'css':'styles/style.css',
			'img': {
				src: 'images/loading.gif',
				tpl: '<img src="%s" ng-show="layout.loading">'
			}
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch',function() {
	gulp.watch('src/styles/style.scss',['sass']);
});

gulp.task('default',['sass','scripts','html','watch']);