'use strict';

var gulp   = require('gulp'),
    karma  = require('karma').server,
    config = require('../build.config.js');

/*************************************
  *           Karma Task
**************************************/

gulp.task('test', test);

function test (done) {
    karma.start({
        configFile: __dirname + '/../karma.config.js',
        singleRun: true,
    }, done);
}

gulp.task('tdd', tdd);

function tdd (done) {
    karma.start({
        configFile: __dirname + '/../karma.config.js',
        singleRun: false,
        autoWatch: true
    }, done);
}
