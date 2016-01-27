var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload = require('gulp-livereload'),
    rename = require('gulp-rename');

var input = './scss/style.scss',
    target = './scss/**/*.scss';
    output = './public/stylesheets',
    sassOptions = {
        errLogToConsole: true,
        outputStyle: 'compressed'
    },
    autoprefixerOptions = {
        browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
    };
gulp.task('sass', function () {
    return gulp
        .src(input)
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(autoprefixerOptions))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(output))
        .pipe(livereload())
        //.pipe(sassdoc())
        // Release the pressure back and trigger flowing mode (drain)
        // See: http://sassdoc.com/gulp/#drain-event
        .resume();
});
gulp.task('watch', function () {
    livereload.listen();
    return gulp
        .watch(target, ['sass']);
        //.on('change', function(event){
        //
        //});
});
gulp.task('default', ['sass', 'watch']);