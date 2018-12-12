// var gulp = require('gulp'),
//     sass = require('gulp-sass'),
//     sourcemaps = require('gulp-sourcemaps'),
//     autoprefixer = require('gulp-autoprefixer'),
//     rename = require('gulp-rename'),
//     server = require('gulp-express');

const gulp = require('gulp'),
    plugins = require('gulp-load-plugins')({
        pattern: ['gulp-*', /*'!gulp', */'!gulp-load-plugins'],
        rename : {
            'browser-sync'    : 'browserSync',
        }
    }),
    sassConfig = {
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
        source: 'bin/www',
        js: ['views/**/*', 'routes/**/*.js', 'models/**/*.js', 'app.js'],
        options: {
        }
    };

gulp.task('sass', function () {
    return gulp
        .src(sassConfig.input)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass(sassConfig.sassOptions).on('error', plugins.sass.logError))
        .pipe(plugins.sourcemaps.write())
        .pipe(plugins.autoprefixer(sassConfig.autoprefixerOptions))
        .pipe(plugins.rename({suffix: '.min'}))
        .pipe(gulp.dest(sassConfig.output))
        // .pipe(livereload())
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

    plugins.express.run([expressConfig.source],[expressConfig.options]);

    gulp.watch([sassConfig.target], gulp.series('sass'));
    gulp.watch([sassConfig.output + '/**/*.css'], plugins.express.notify);
    gulp.watch(expressConfig.js, function (event) {
        plugins.express.run([expressConfig.source]);
        plugins.express.notify(event)
    });
});
gulp.task('default', gulp.series('sass', 'server'));