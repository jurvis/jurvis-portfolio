var gulp = require('gulp'),
			rename = require('gulp-rename'),
			minifyHTML = require('gulp-minify-html'),
			minifyCss = require('gulp-minify-css'),
			imagemin = require('gulp-imagemin'),
			notify = require('gulp-notify'),
			cache = require('gulp-cache'),
			browserSync = require('browser-sync');

var dist = 'build/'
,	dirPublic = dist + 'public/'
,	distStylesheets = dirPublic + 'assets/css'
,	distImages = dirPublic + 'assets/img'
,	distFonts = dirPublic + 'assets/fonts'

var reload = browserSync.reload;

gulp.task('dev', function() {
	gulp.run('build');
	gulp.run('image');
	gulp.run('serve');
});

gulp.task('serve', function() {
	gulp.run('build');
	browserSync({
		proxy: "localhost:8888/nebulo-landing"
	});

	gulp.watch([
        '*.html',
        'assets/css/*.css'
    ], function(event) {
        gulp.run('build');
        reload;
    });
});

gulp.task('build', function() {

	gulp.src('assets/css/*.css')
		.pipe(minifyCss())
		.pipe(gulp.dest(distStylesheets))
		.pipe(rename({suffix : '.min'}));

	gulp.src('*.html')
		.pipe(minifyHTML())
		.pipe(gulp.dest(dirPublic));

	gulp.src('assets/fonts/*')
		.pipe(gulp.dest(distFonts))
});

gulp.task('image', function() {
	return gulp.src('assets/img/**/*')
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest(distImages))
		.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('default', function() {
	gulp.run('build');
	gulp.run('image');
});
