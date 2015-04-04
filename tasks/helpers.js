module.exports = {
    handleError: function(err) {
        console.error(err.toString());
        //console.error('BURP');
        process.stdout.write('\x07');
        this.emit('end');
    }
};

