'use strict';

var gulp           = require('gulp'),
    glp_livereload = require('gulp-livereload'),
    config         = require('../build.config.js');

/*************************************
  *    Watcher function / task
**************************************/

gulp.task('watcher', watcher);

function watcher () {
    var server        = glp_livereload(),
        examplesGlob  = config.files.examples.dest + '/**/*.{html,js,css,json}',
        jsWatch       = gulp.watch(config.files.js.src, ['js']),
        jsXWatch      = gulp.watch(config.files.examples.js.src, ['jsExamples']),
        indexWatch    = gulp.watch(config.files.examples.index.src, ['inject']),
        sassWatch     = gulp.watch(config.files.examples.sass.src, ['sass']),
        dataWatch     = gulp.watch(config.files.examples.src + '/data/*.json', ['copy']),
        examplesWatch = gulp.watch(examplesGlob);

    jsWatch.on('change', function (event) {
        server.changed(event.path);
    });
    // reloads when files change in build directory
    examplesWatch.on('change', function (event) {
        server.changed(event.path);
    });
}
