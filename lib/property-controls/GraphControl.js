// Import dependencies
import { BaseControl, BaseControlEvent } from './BaseControl';
import { Interpolation } from '../common/math';

// Event String Constants
export var GraphControlEvent = Object.assign({
    ADD_POINTS: 'control:add_points',
    REMOVE_POINT: 'control:remove_point'
}, BaseControlEvent);

export class GraphControl extends BaseControl {

    constructor (options={}) {
        super(options);

        this.controlName = options.controlName || 'GraphControl';
        this.points = options.points || [];
        this.__sortPointsByTime();
        this.__progressListener = this.__onProgressChange.bind(this);
    }

    addPoints (pointsObj) {
        /* jshint ignore:start */
        if (!Array.isArray(pointsObj)
            && !(pointsObj instanceof Object)) {
            return false;
        }
        /* jshint ignore:end */

        if (Array.isArray(pointsObj)) {
            this.points = this.points.concat(pointsObj);
        } else if (pointsObj instanceof Object) {
            this.points.push(pointsObj);
            this.__sortPointsByTime();
        }

        this.emit(GraphControlEvent.ADD_POINTS , this.points);
        return this.points;
    }

    removePoint (pointIndex) {
        /* jshint ignore:start */
        if (typeof pointIndex === 'number'
            && pointIndex > 0
            && pointIndex < this.points.length - 1) {
            this.points.splice(pointIndex, 1);
            this.emit(GraphControlEvent.REMOVE_POINT, this.points);
            return this.points;
        }
        /* jshint ignore:end */
    }

    setValueFromProgress(progress) {
        this.value = this.__calculateValueFromProgress(progress);
    }

    get points () {
        return this.model.points;
    }

    set points (pointsArray) {
        this.model.points = pointsArray;
        this.__sortPointsByTime();
    }


    /*************************************
      *      Internal Methods
    **************************************/

    __sortPointsByTime () {
        this.points.sort(function (a, b) {
            return a.t - b.t;
        });
        return this.points;
    }

    __findTimeBoundryPoints (t) {
        // Points should already be sorted by t.
        var endIndex    = null,
            startIndex  = null,
            pointsTotal = this.points.length,
            lastIndex   = pointsTotal - 1;

        for (var i = 0; i < pointsTotal; i++) {
            let point = this.points[i];

            if (point.t > t) {
                startIndex = i - 1;
                endIndex   = i;
                break;

            } else if (i === lastIndex) {
                startIndex = i - 1;
                endIndex   = i;
                break;

            } else if (point.t === t) {
                startIndex = i;
                endIndex   = i + 1;
                break;
            }
        }

        if (startIndex !== null && endIndex !== null) {
            return [this.points[startIndex], this.points[endIndex]];
        }
    }

    __calculateValueFromProgress (t) {
       // Get interpolation function based first points type
        var points = this.__findTimeBoundryPoints(t),
            p1 = points[0],
            p2 = points[1];

        // start time
        var st = t - p1.t;
        // local point time
        var lpt = (1 / (p2.t - p1.t)) * st;

        return Math.round(Interpolation.smoothStep(lpt, p1.v, p2.v) * 1000) / 1000;
    }

    __onProgressChange(e) {
        this.value = this.__calculateValueFromProgress(e.progress);
    }
}

export default GraphControl;
