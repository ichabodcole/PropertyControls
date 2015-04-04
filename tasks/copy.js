'use strict';

var gulp   = require('gulp'),
    config = require('../build.config.js');

/*************************************
  *           Copy Task
**************************************/

gulp.task('copy', copy);

function copy () {
    gulp.src(config.files.examples.src + '/data/*')
        .pipe(gulp.dest(config.files.examples.dest + '/data'));
}
