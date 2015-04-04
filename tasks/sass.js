'use strict';

var gulp           = require('gulp'),
    glp_sass       = require('gulp-sass'),
    glp_plumber    = require('gulp-plumber'),
    glp_autoprefix = require('gulp-autoprefixer'),
    config         = require('../build.config.js');

/*************************************
  *           Sass Task
**************************************/

gulp.task('sass', sass);

function sass () {
  return gulp.src(config.files.examples.sass.src)
    .pipe(glp_plumber())
    .pipe(glp_sass())
    .pipe(glp_autoprefix())
    .pipe(gulp.dest(config.files.examples.sass.dest));
}
