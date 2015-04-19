var config = {
    src: 'lib',
    build: '.tmp'
};

var explsSrc = 'examples',
    explsDst = config.build + '/examples';

config.js = {
    src: config.src + '/**/*.js'
};

module.exports = config;
