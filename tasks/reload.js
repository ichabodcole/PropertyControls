'use strict';

var gulp  = require('gulp'),
    spawn = require('child_process').spawn;

/*************************************
  *        Auto reload gulp
**************************************/

gulp.task('reload', reload);

function reload () {
    var process;
    function restart() {
        console.log('restarting gulp');
        if (process) {
            process.kill();
        }
        process = spawn('gulp', ['serve', 'watcher'], {stdio: 'inherit'});
    }
    gulp.watch(['gulpfile.js', './tasks/*.js'], restart);
    restart();
}
