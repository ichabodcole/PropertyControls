'use strict';

var env = process.env.NODE_ENV || 'development';
var path = require('path');

var gulp        = require('gulp'),
    del         = require('del'),
    browserify  = require('browserify'),
    browserSync = require('browser-sync'),
    babelify    = require('babelify'),
    source      = require('vinyl-source-stream'),
    jsStylish   = require('jshint-stylish'),
    karma       = require('karma').server;

var $ = require('gulp-load-plugins')();

var config = require('./build.config.js');

// var $ = require('gulp-load-plugins')();

gulp.task('tdd', tdd);
gulp.task('test', test);
gulp.task('jshint', jshint);

// function serve() {
//     browserSync({
//         server: {
//             port: 9000,
//             baseDir: [
//                 path.join(__dirname, '../', config.dist),
//                 path.join(__dirname, '../', config.files.examples.dest)
//             ]
//         }
//     });
// }

/* Test tasks */
function tdd (done) {
    karma.start({
        configFile: path.join(__dirname, 'karma.conf.js'),
        singleRun: false,
        autoWatch: true
    }, done);
}

function test (done) {
    karma.start({
        configFile: path.join(__dirname, 'karma.conf.js'),
        singleRun: true,
    });
    done();
}

/* JavaScript Tasks */
function jshint() {
    return gulp.src([config.js.src, config.examples.js.src])
        .pipe($.jshint())
        .on('error', handleError)
        .pipe($.jshint.reporter(jsStylish));
}

// function exampleJs() {
//     var entryFile = config.files.examples.js.src
//         srcName = 'property-controls.js'
//         dest = config.files.examples.js.dest

//     return browserify()
//         .transform(babelify)
//         .require(require.resolve(entryFile), {entry: true})
//         .bundle()
//         .on('error', handleError)
//         .pipe(source(srcName))
//         .pipe(gulp.dest(dest));
// }

function clean (done) {
    del([
        config.dist,
        config.files.examples.dest
    ], done);
}

function handleError(err) {
    console.error(err.toString());
    //console.error('BURP');
    process.stdout.write('\x07');
    this.emit('end');
}
