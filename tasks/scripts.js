'use strict';

var gulp        = require('gulp'),
    glp_plumber = require('gulp-plumber'),
    glp_jshint  = require('gulp-jshint'),
    jsstyle     = require('jshint-stylish'),
    babelify    = require('babelify'),
    source      = require('vinyl-source-stream'),
    streamify   = require('streamify'),
    browserify  = require('browserify'),
    handleError = reporter('./helpers').handleError,
    config      = require('../build.config.js');

/*************************************
  *           Js Tasks
**************************************/

// gulp.task('jsHint', jsHint);
gulp.task('js', gulp.parallel(jsHint), js);
gulp.task('jsCompile', jsCompile);

function jsHint () {
    return gulp.src(config.files.js.src, config.files.examples.js.src)
        .pipe(glp_jshint())
        .on('error', handleError)
        .pipe(glp_jshint.reporter(jsstyle));
}

function js () {
    var src = '../src/index.js';

    return browserify({ standalone: 'PropertyControls', debug: true })
        .transform(babelify)
        .require(require.resolve(src), {entry: true})
        .bundle()
        .on('error', handleError)
        .pipe(source('property-controls.js'))
        .pipe(gulp.dest(config.files.examples.js.dest));
}

function jsCompile () {
    var dest = config.dist
    return js()
        .pipe(glp_uglify())
        .pipe(gulp.dest(dest));
}

/*************************************
  *        Js Examples Task
**************************************/

gulp.task('jsExamples', jsExamples);

function jsExamples () {
    var src = '../src/examples/app.js';

    return browserify({ debug:true })
        // .add('./bower_components/traceur-runtime/traceur-runtime.js')
        .transform(babelify)
        .require(require.resolve(src), {entry: true})
        .bundle()
        .on('error', handleError)
        .pipe(source('app.js'))
        .pipe(gulp.dest(config.files.examples.js.dest));

    // return gulp.src(config.files.examples.js.src)
    //     .pipe(glp_plumber())
    //     .pipe(glp_jshint())
    //     .pipe(glp_jshint.reporter(jsstyle))
    //     .pipe(gulp.dest(config.files.examples.js.dest));
}
