'use strict';

var gulp        = require('gulp'),
    browserSync = require('browser-sync'),
    path        = require('path'),
    config      = require('../build.config.js');

/*************************************
  *          Serve Task
**************************************/

gulp.task('serve', ['build', 'inject', 'watcher'], serve);

function serve ( ){
    browserSync({
        server: {
            port: 9000,
            baseDir: [
                path.join(__dirname, '../', config.dist),
                path.join(__dirname, '../', config.files.examples.dest)
            ]
        }
    });
}
