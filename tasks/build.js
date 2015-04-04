'use strict';

var gulp     = require('gulp'),
    sequence = require('run-sequence'),
    config   = require('../build.config.js');

/*************************************
  *           Build Task
**************************************/

gulp.task('build', build);

function build (cb) {
  sequence(['jsExamples', 'sass', 'copy'], 'inject', cb);
}
