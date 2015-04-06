export var Interpolation = {
    linear: function (t, p0, p1) {
        return p0 * ( 1 - t ) + p1 * t;
    },

    cubic: function (t, p0, p1, p2, p3) {
        var a = Math.pow(t, 3),
            b = 3 * Math.pow(t, 2) * (1 - t),
            c = 3 * t * Math.pow(1 - t, 2),
            d = Math.pow(1 - t, 3);

        return ( p0 * a + p1 * b + p2 * c + p3 * d );
    },

    smoothStep: function (t, p0, p1) {
        t = t * t * (3 - 2 * t);
        return p0 * ( 1 - t ) + p1 * t;
    },

    median: function (p0, p1) {
        return (p0 - p1) / 2 + p0;
    }
};
