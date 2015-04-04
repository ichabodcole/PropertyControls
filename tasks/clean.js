'use strict';

var gulp   = require('gulp'),
    del    = require('del'),
    config = require('../build.config.js');

/*************************************
  *          Clean Task
**************************************/

gulp.task('clean', clean);

function clean (cb) {
    del([
        config.dist,
        config.files.examples.dest
    ], cb);
}
