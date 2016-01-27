var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    //livereload = require('gulp-livereload'),
    rename = require('gulp-rename'),
    server = require('gulp-express');

var sassConfig = {
        input: './scss/style.scss',
        target: './scss/**/*.scss',
        output: './public/stylesheets',
        sassOptions: {
            errLogToConsole: true,
            outputStyle: 'compressed'
        },
        autoprefixerOptions: {
            browsers: ['last 2 versions', '> 5%', 'Firefox ESR']
        }
    },
    expressConfig = {
        source : 'bin/www',
        js:['views/**/*','routes/**/*.js']
    };

gulp.task('sass', function () {
    return gulp
        .src(sassConfig.input)
        .pipe(sourcemaps.init())
        .pipe(sass(sassConfig.sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(autoprefixer(sassConfig.autoprefixerOptions))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(sassConfig.output))
        //.pipe(livereload())
        //.pipe(sassdoc())
        // Release the pressure back and trigger flowing mode (drain)
        // See: http://sassdoc.com/gulp/#drain-event
        .resume();
});

//gulp.task('watch', function () {
//    livereload.listen();
//    return gulp
//        .watch(sassConfig.target, ['sass']);
//});

gulp.task('server', function () {
    server.run([expressConfig.source]);

    gulp.watch([sassConfig.target], ['sass']);
    gulp.watch([sassConfig.output+'/**/*.css'], server.notify);
    gulp.watch(expressConfig.js, function(event){
        server.run([expressConfig.source]);
        server.notify(event)
    });
});
gulp.task('default', ['sass', 'server']);