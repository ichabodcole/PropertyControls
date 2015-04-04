var config = {
    src: 'lib',
    temp: '.tmp'
};

var explsSrc = 'examples',
    explsDst = config.temp + '/examples';

config.js = {
    src: config.src + '/**/*.js'
};

config.examples = {
    src: explsSrc,
    dest: explsDst,
    index: {
        src: explsSrc + '/index.html',
        dest: explsDst + '/index.html'
    },
    js: {
        src: explsSrc + '/**/*.js',
        dest: explsDst
    },
    sass: {
        src: explsSrc + '/**/*.scss',
        dest: explsDst + '/css'
    }
};

module.exports = config;
