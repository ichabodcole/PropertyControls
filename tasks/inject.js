'use strict';

var gulp        = require('gulp'),
    path        = require('path'),
    es          = require('event-stream'),
    glp_wiredep = require('wiredep').stream,
    glp_order   = require('gulp-order'),
    glp_inject  = require('gulp-inject'),
    config      = require('../build.config.js');

/*************************************
  *         Inject Task
**************************************/

gulp.task('inject', inject);

function inject () {
    var jsFiles      = gulp.src([config.files.js.dest + '/*.js', config.files.examples.js.dest + '/*.js']),
        cssFiles     = gulp.src([config.files.examples.sass.dest + '/*.css']),
        injectStream = es.merge(jsFiles, cssFiles)
            .pipe(glp_order(['soundscape.js', 'soundscape-factory.js', 'app.js']));

    return gulp.src(config.files.examples.index.src)
        .pipe(glp_wiredep({ ignorePath: path.join('../../', config.bower) }))
        .pipe(glp_inject(injectStream, { ignorePath: [config.app, config.dist, config.files.examples.dest] }))
        .pipe(gulp.dest(config.files.examples.dest));
}
