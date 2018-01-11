var gulp = require('gulp');
var ts = require('gulp-typescript');
var buble = require('gulp-buble');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('ts-es6', function(){
  return gulp.src('ts/*.ts')
    .pipe(ts())
    .pipe(gulp.dest('./src/'))
});

gulp.task('es6-es5', function(){
  return gulp.src('src/*.js')
    .pipe(buble())
	.pipe(concat('Tween.js'))
    .pipe(gulp.dest('./bundled/'))
});

gulp.task('minify', function(){
  return gulp.src('src/*.js')
    .pipe(buble())
	.pipe(uglify())
	.pipe(concat('Tween.min.js'))
	.pipe(gulp.dest('./bundled/'))
});

gulp.task('watch', function(){
	gulp.watch('ts/*.ts', [ 'ts-es6', 'es6-es5' ]);
});

gulp.task('default', [ 'ts-es6', 'es6-es5', 'minify' ]);